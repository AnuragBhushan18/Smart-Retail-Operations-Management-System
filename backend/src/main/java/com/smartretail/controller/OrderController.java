package com.smartretail.controller;

import com.smartretail.dto.OrderRequest;
import com.smartretail.dto.OrderResponse;
import com.smartretail.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * ============================================================
 * OrderController - REST API for Order Management
 *
 * Base URL: /api/orders
 *
 * Endpoints:
 *   POST   /api/orders                        → Create a new order
 *   GET    /api/orders                        → Get all orders
 *   GET    /api/orders/{id}                   → Get order by ID
 *   GET    /api/orders/customer/{customerId}  → Orders by customer
 *   GET    /api/orders/status/{status}        → Orders by status
 *   GET    /api/orders/search?customerName=   → Search by customer name
 *   PATCH  /api/orders/{id}/status            → Update order status
 *   DELETE /api/orders/{id}                   → Delete order
 * ============================================================
 */
@RestController
@RequestMapping("/orders")
@Tag(name = "Order Management", description = "APIs for managing the full order lifecycle")
@CrossOrigin(origins = "*")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    // ─── CREATE ───────────────────────────────────────────────────────────────

    @PostMapping
    @Operation(summary = "Create a new order",
            description = "Places a new order for a customer. Automatically deducts stock from inventory. " +
                          "Product prices and names are snapshotted at time of order.")
    public ResponseEntity<OrderResponse> createOrder(
            @Valid @RequestBody OrderRequest request) {
        OrderResponse response = orderService.createOrder(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // ─── READ ─────────────────────────────────────────────────────────────────

    @GetMapping
    @Operation(summary = "Get all orders", description = "Returns a list of all orders in the system.")
    public ResponseEntity<List<OrderResponse>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get order by ID", description = "Returns a single order with all its line items.")
    public ResponseEntity<OrderResponse> getOrderById(@PathVariable String id) {
        return ResponseEntity.ok(orderService.getOrderById(id));
    }

    @GetMapping("/customer/{customerId}")
    @Operation(summary = "Get orders by customer",
            description = "Returns all orders placed by a specific customer.")
    public ResponseEntity<List<OrderResponse>> getOrdersByCustomer(
            @PathVariable String customerId) {
        return ResponseEntity.ok(orderService.getOrdersByCustomer(customerId));
    }

    @GetMapping("/status/{status}")
    @Operation(summary = "Get orders by status",
            description = "Filter orders by status: PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED.")
    public ResponseEntity<List<OrderResponse>> getOrdersByStatus(
            @PathVariable String status) {
        return ResponseEntity.ok(orderService.getOrdersByStatus(status));
    }

    @GetMapping("/search")
    @Operation(summary = "Search orders by customer name",
            description = "Returns orders whose customer name contains the keyword (case-insensitive).")
    public ResponseEntity<List<OrderResponse>> searchOrders(
            @RequestParam String customerName) {
        return ResponseEntity.ok(orderService.searchOrders(customerName));
    }

    // ─── UPDATE ───────────────────────────────────────────────────────────────

    @PatchMapping("/{id}/status")
    @Operation(summary = "Update order status",
            description = "Transitions an order to a new status. " +
                          "Valid transitions: PENDING → CONFIRMED → SHIPPED → DELIVERED. " +
                          "DELIVERED and CANCELLED orders cannot be changed. " +
                          "Cancelling an order restores product stock.")
    public ResponseEntity<OrderResponse> updateOrderStatus(
            @PathVariable String id,
            @RequestBody Map<String, String> body) {
        String status = body.get("status");
        if (status == null || status.isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(orderService.updateOrderStatus(id, status));
    }

    // ─── DELETE ───────────────────────────────────────────────────────────────

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete an order",
            description = "Permanently deletes an order. Stock is restored if the order was not yet delivered.")
    public ResponseEntity<Void> deleteOrder(@PathVariable String id) {
        orderService.deleteOrder(id);
        return ResponseEntity.noContent().build();
    }
}
