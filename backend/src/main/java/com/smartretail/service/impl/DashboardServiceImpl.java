package com.smartretail.service.impl;

import com.smartretail.config.AppConfig;
import com.smartretail.dto.DashboardResponse;
import com.smartretail.dto.ProductResponse;
import com.smartretail.repository.*;
import com.smartretail.service.DashboardService;
import com.smartretail.service.ProductService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DashboardServiceImpl implements DashboardService {

    private static final Logger log = LoggerFactory.getLogger(DashboardServiceImpl.class);

    private final ProductRepository  productRepository;
    private final CategoryRepository categoryRepository;
    private final SupplierRepository supplierRepository;
    private final CustomerRepository customerRepository;
    private final OrderRepository    orderRepository;
    private final ProductService     productService;
    private final AppConfig          appConfig;

    public DashboardServiceImpl(ProductRepository productRepository,
                                CategoryRepository categoryRepository,
                                SupplierRepository supplierRepository,
                                CustomerRepository customerRepository,
                                OrderRepository orderRepository,
                                ProductService productService,
                                AppConfig appConfig) {
        this.productRepository  = productRepository;
        this.categoryRepository = categoryRepository;
        this.supplierRepository = supplierRepository;
        this.customerRepository = customerRepository;
        this.orderRepository    = orderRepository;
        this.productService     = productService;
        this.appConfig          = appConfig;
    }

    @Override
    public DashboardResponse getDashboardStats() {
        log.info("Building dashboard statistics");

        int threshold = appConfig.getLowStockThreshold();

        long totalProducts   = productRepository.count();
        long totalCategories = categoryRepository.count();
        long totalSuppliers  = supplierRepository.count();
        long totalCustomers  = customerRepository.count();
        long totalOrders     = orderRepository.count();

        long pendingOrders   = orderRepository.countByStatus("PENDING");
        long confirmedOrders = orderRepository.countByStatus("CONFIRMED");
        long shippedOrders   = orderRepository.countByStatus("SHIPPED");
        long deliveredOrders = orderRepository.countByStatus("DELIVERED");

        List<ProductResponse> lowStockProducts = productService.getLowStockProducts(threshold);
        long lowStockCount = lowStockProducts.size();

        double totalInventoryValue = productRepository.findAll().stream()
                .mapToDouble(p -> p.getPrice() != null && p.getStockQuantity() != null
                        ? p.getPrice() * p.getStockQuantity() : 0.0)
                .sum();

        DashboardResponse response = new DashboardResponse();
        response.setTotalProducts(totalProducts);
        response.setTotalCategories(totalCategories);
        response.setTotalSuppliers(totalSuppliers);
        response.setTotalCustomers(totalCustomers);
        response.setTotalOrders(totalOrders);
        response.setPendingOrders(pendingOrders);
        response.setConfirmedOrders(confirmedOrders);
        response.setShippedOrders(shippedOrders);
        response.setDeliveredOrders(deliveredOrders);
        response.setLowStockProducts(lowStockProducts);
        response.setLowStockCount(lowStockCount);
        response.setTotalInventoryValue(totalInventoryValue);
        return response;
    }
}
