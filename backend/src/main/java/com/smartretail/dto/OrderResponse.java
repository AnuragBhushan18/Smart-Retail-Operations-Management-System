package com.smartretail.dto;

import java.time.LocalDateTime;
import java.util.List;

/**
 * ============================================================
 * OrderResponse DTO - Outgoing API response for Order data.
 * ============================================================
 *
 * Includes fully populated order items with product names and prices.
 * Example response:
 * {
 *   "id": "64f1...",
 *   "customerId": "64f2...",
 *   "customerName": "Rahul Sharma",
 *   "items": [
 *     {
 *       "productId": "64f3...",
 *       "productName": "iPhone 15",
 *       "quantity": 2,
 *       "unitPrice": 79999.00,
 *       "subtotal": 159998.00
 *     }
 *   ],
 *   "totalAmount": 159998.00,
 *   "status": "PENDING",
 *   "orderDate": "2024-01-01T10:00:00"
 * }
 * ============================================================
 */
public class OrderResponse {

    private String id;
    private String customerId;
    private String customerName;
    private List<OrderItemResponse> items;
    private LocalDateTime orderDate;
    private Double totalAmount;
    private String status;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // ─── Constructors ────────────────────────────────────────────────────────

    public OrderResponse() {
    }

    public OrderResponse(String id, String customerId, String customerName,
                         List<OrderItemResponse> items, LocalDateTime orderDate,
                         Double totalAmount, String status, String notes,
                         LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.customerId = customerId;
        this.customerName = customerName;
        this.items = items;
        this.orderDate = orderDate;
        this.totalAmount = totalAmount;
        this.status = status;
        this.notes = notes;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // ─── Getters ─────────────────────────────────────────────────────────────

    public String getId() {
        return id;
    }

    public String getCustomerId() {
        return customerId;
    }

    public String getCustomerName() {
        return customerName;
    }

    public List<OrderItemResponse> getItems() {
        return items;
    }

    public LocalDateTime getOrderDate() {
        return orderDate;
    }

    public Double getTotalAmount() {
        return totalAmount;
    }

    public String getStatus() {
        return status;
    }

    public String getNotes() {
        return notes;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    // ─── Setters ─────────────────────────────────────────────────────────────

    public void setId(String id) {
        this.id = id;
    }

    public void setCustomerId(String customerId) {
        this.customerId = customerId;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public void setItems(List<OrderItemResponse> items) {
        this.items = items;
    }

    public void setOrderDate(LocalDateTime orderDate) {
        this.orderDate = orderDate;
    }

    public void setTotalAmount(Double totalAmount) {
        this.totalAmount = totalAmount;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    // ─── Builder ──────────────────────────────────────────────────────────────

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String id;
        private String customerId;
        private String customerName;
        private List<OrderItemResponse> items;
        private LocalDateTime orderDate;
        private Double totalAmount;
        private String status;
        private String notes;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        private Builder() {
        }

        public Builder id(String id) {
            this.id = id;
            return this;
        }

        public Builder customerId(String customerId) {
            this.customerId = customerId;
            return this;
        }

        public Builder customerName(String customerName) {
            this.customerName = customerName;
            return this;
        }

        public Builder items(List<OrderItemResponse> items) {
            this.items = items;
            return this;
        }

        public Builder orderDate(LocalDateTime orderDate) {
            this.orderDate = orderDate;
            return this;
        }

        public Builder totalAmount(Double totalAmount) {
            this.totalAmount = totalAmount;
            return this;
        }

        public Builder status(String status) {
            this.status = status;
            return this;
        }

        public Builder notes(String notes) {
            this.notes = notes;
            return this;
        }

        public Builder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public Builder updatedAt(LocalDateTime updatedAt) {
            this.updatedAt = updatedAt;
            return this;
        }

        public OrderResponse build() {
            return new OrderResponse(id, customerId, customerName, items, orderDate,
                    totalAmount, status, notes, createdAt, updatedAt);
        }
    }

    // ─── Inner class ──────────────────────────────────────────────────────────

    /** Response for each order line item */
    public static class OrderItemResponse {

        private String productId;
        private String productName;
        private Integer quantity;
        private Double unitPrice;
        private Double subtotal;

        // Constructors

        public OrderItemResponse() {
        }

        public OrderItemResponse(String productId, String productName, Integer quantity,
                                 Double unitPrice, Double subtotal) {
            this.productId = productId;
            this.productName = productName;
            this.quantity = quantity;
            this.unitPrice = unitPrice;
            this.subtotal = subtotal;
        }

        // Getters

        public String getProductId() {
            return productId;
        }

        public String getProductName() {
            return productName;
        }

        public Integer getQuantity() {
            return quantity;
        }

        public Double getUnitPrice() {
            return unitPrice;
        }

        public Double getSubtotal() {
            return subtotal;
        }

        // Setters

        public void setProductId(String productId) {
            this.productId = productId;
        }

        public void setProductName(String productName) {
            this.productName = productName;
        }

        public void setQuantity(Integer quantity) {
            this.quantity = quantity;
        }

        public void setUnitPrice(Double unitPrice) {
            this.unitPrice = unitPrice;
        }

        public void setSubtotal(Double subtotal) {
            this.subtotal = subtotal;
        }

        // Builder

        public static OrderItemResponseBuilder builder() {
            return new OrderItemResponseBuilder();
        }

        public static class OrderItemResponseBuilder {
            private String productId;
            private String productName;
            private Integer quantity;
            private Double unitPrice;
            private Double subtotal;

            private OrderItemResponseBuilder() {
            }

            public OrderItemResponseBuilder productId(String productId) {
                this.productId = productId;
                return this;
            }

            public OrderItemResponseBuilder productName(String productName) {
                this.productName = productName;
                return this;
            }

            public OrderItemResponseBuilder quantity(Integer quantity) {
                this.quantity = quantity;
                return this;
            }

            public OrderItemResponseBuilder unitPrice(Double unitPrice) {
                this.unitPrice = unitPrice;
                return this;
            }

            public OrderItemResponseBuilder subtotal(Double subtotal) {
                this.subtotal = subtotal;
                return this;
            }

            public OrderItemResponse build() {
                return new OrderItemResponse(productId, productName, quantity, unitPrice, subtotal);
            }
        }
    }
}
