package com.smartretail.service.impl;

import com.smartretail.dto.OrderRequest;
import com.smartretail.dto.OrderResponse;
import com.smartretail.exception.ResourceNotFoundException;
import com.smartretail.model.Customer;
import com.smartretail.model.Order;
import com.smartretail.model.OrderItem;
import com.smartretail.model.Product;
import com.smartretail.repository.CustomerRepository;
import com.smartretail.repository.OrderRepository;
import com.smartretail.repository.ProductRepository;
import com.smartretail.service.OrderService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class OrderServiceImpl implements OrderService {

    private static final Logger log = LoggerFactory.getLogger(OrderServiceImpl.class);

    private static final Set<String> VALID_STATUSES =
            Set.of("PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED");

    private final OrderRepository    orderRepository;
    private final CustomerRepository customerRepository;
    private final ProductRepository  productRepository;

    public OrderServiceImpl(OrderRepository orderRepository,
                            CustomerRepository customerRepository,
                            ProductRepository productRepository) {
        this.orderRepository    = orderRepository;
        this.customerRepository = customerRepository;
        this.productRepository  = productRepository;
    }

    @Override
    public OrderResponse createOrder(OrderRequest request) {
        log.info("Creating order for customerId: {}", request.getCustomerId());

        Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new ResourceNotFoundException(
                    "Customer", "id", request.getCustomerId()));

        List<OrderItem> orderItems = new ArrayList<>();
        double totalAmount = 0.0;

        for (OrderRequest.OrderItemRequest itemRequest : request.getItems()) {
            Product product = productRepository.findById(itemRequest.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                        "Product", "id", itemRequest.getProductId()));

            if (product.getStockQuantity() < itemRequest.getQuantity()) {
                throw new IllegalArgumentException(
                    "Insufficient stock for product '" + product.getName() +
                    "'. Available: " + product.getStockQuantity() +
                    ", Requested: " + itemRequest.getQuantity());
            }

            double subtotal = product.getPrice() * itemRequest.getQuantity();

            OrderItem orderItem = new OrderItem();
            orderItem.setProductId(product.getId());
            orderItem.setProductName(product.getName());
            orderItem.setQuantity(itemRequest.getQuantity());
            orderItem.setUnitPrice(product.getPrice());
            orderItem.setSubtotal(subtotal);
            orderItems.add(orderItem);
            totalAmount += subtotal;

            product.setStockQuantity(product.getStockQuantity() - itemRequest.getQuantity());
            if (product.getStockQuantity() == 0) {
                product.setStatus("OUT_OF_STOCK");
            }
            productRepository.save(product);
        }

        Order order = new Order();
        order.setCustomerId(customer.getId());
        order.setCustomerName(customer.getName());
        order.setItems(orderItems);
        order.setOrderDate(LocalDateTime.now());
        order.setTotalAmount(totalAmount);
        order.setStatus("PENDING");
        order.setNotes(request.getNotes());

        Order saved = orderRepository.save(order);
        log.info("Order created: {} for customer: {}", saved.getId(), customer.getName());
        return mapToResponse(saved);
    }

    @Override
    public OrderResponse getOrderById(String id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", id));
        return mapToResponse(order);
    }

    @Override
    public List<OrderResponse> getAllOrders() {
        return orderRepository.findAll().stream()
                .map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    public List<OrderResponse> getOrdersByCustomer(String customerId) {
        customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer", "id", customerId));
        return orderRepository.findByCustomerId(customerId).stream()
                .map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    public List<OrderResponse> getOrdersByStatus(String status) {
        String upperStatus = status.toUpperCase();
        if (!VALID_STATUSES.contains(upperStatus)) {
            throw new IllegalArgumentException("Invalid status. Valid: " + VALID_STATUSES);
        }
        return orderRepository.findByStatus(upperStatus).stream()
                .map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    public List<OrderResponse> searchOrders(String customerName) {
        return orderRepository.findByCustomerNameContainingIgnoreCase(customerName).stream()
                .map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    public OrderResponse updateOrderStatus(String id, String status) {
        log.info("Updating order {} status to {}", id, status);

        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", id));

        String newStatus = status.toUpperCase();
        if (!VALID_STATUSES.contains(newStatus)) {
            throw new IllegalArgumentException("Invalid status: " + status);
        }

        if ("DELIVERED".equals(order.getStatus()) || "CANCELLED".equals(order.getStatus())) {
            throw new IllegalArgumentException(
                "Cannot change status of a " + order.getStatus() + " order");
        }

        if ("CANCELLED".equals(newStatus) && !"CANCELLED".equals(order.getStatus())) {
            restoreStock(order);
        }

        order.setStatus(newStatus);
        Order updated = orderRepository.save(order);
        return mapToResponse(updated);
    }

    @Override
    public void deleteOrder(String id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", id));

        if (!"DELIVERED".equals(order.getStatus())) {
            restoreStock(order);
        }

        orderRepository.deleteById(id);
        log.info("Order deleted: {}", id);
    }

    private void restoreStock(Order order) {
        for (OrderItem item : order.getItems()) {
            productRepository.findById(item.getProductId()).ifPresent(product -> {
                product.setStockQuantity(product.getStockQuantity() + item.getQuantity());
                if ("OUT_OF_STOCK".equals(product.getStatus())) {
                    product.setStatus("ACTIVE");
                }
                productRepository.save(product);
                log.info("Restored {} units to product: {}", item.getQuantity(), product.getName());
            });
        }
    }

    private OrderResponse mapToResponse(Order order) {
        List<OrderResponse.OrderItemResponse> itemResponses = order.getItems().stream()
                .map(item -> {
                    OrderResponse.OrderItemResponse ir = new OrderResponse.OrderItemResponse();
                    ir.setProductId(item.getProductId());
                    ir.setProductName(item.getProductName());
                    ir.setQuantity(item.getQuantity());
                    ir.setUnitPrice(item.getUnitPrice());
                    ir.setSubtotal(item.getSubtotal());
                    return ir;
                }).collect(Collectors.toList());

        OrderResponse response = new OrderResponse();
        response.setId(order.getId());
        response.setCustomerId(order.getCustomerId());
        response.setCustomerName(order.getCustomerName());
        response.setItems(itemResponses);
        response.setOrderDate(order.getOrderDate());
        response.setTotalAmount(order.getTotalAmount());
        response.setStatus(order.getStatus());
        response.setNotes(order.getNotes());
        response.setCreatedAt(order.getCreatedAt());
        response.setUpdatedAt(order.getUpdatedAt());
        return response;
    }
}
