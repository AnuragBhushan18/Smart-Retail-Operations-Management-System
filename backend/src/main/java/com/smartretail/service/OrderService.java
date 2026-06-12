package com.smartretail.service;

import com.smartretail.dto.OrderRequest;
import com.smartretail.dto.OrderResponse;

import java.util.List;

/** OrderService interface */
public interface OrderService {
    OrderResponse createOrder(OrderRequest request);
    OrderResponse getOrderById(String id);
    List<OrderResponse> getAllOrders();
    List<OrderResponse> getOrdersByCustomer(String customerId);
    List<OrderResponse> getOrdersByStatus(String status);
    List<OrderResponse> searchOrders(String customerName);
    OrderResponse updateOrderStatus(String id, String status);
    void deleteOrder(String id);
}
