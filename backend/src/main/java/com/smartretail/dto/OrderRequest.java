package com.smartretail.dto;

import jakarta.validation.constraints.*;

import java.util.List;

/**
 * ============================================================
 * OrderRequest DTO - Incoming data for Create/Update Order
 * ============================================================
 *
 * Example request JSON:
 * {
 *   "customerId": "64f1a2b3c4d5e6f7a8b9c0d1",
 *   "items": [
 *     { "productId": "64f2...", "quantity": 2 },
 *     { "productId": "64f3...", "quantity": 1 }
 *   ],
 *   "notes": "Please deliver before 6 PM"
 * }
 *
 * NOTE: totalAmount and productName are NOT sent by the client.
 *       They are calculated by the service layer from the product data.
 * ============================================================
 */
public class OrderRequest {

    @NotBlank(message = "Customer ID is required")
    private String customerId;

    /**
     * @NotEmpty: List must not be null or empty.
     * An order must have at least one product.
     */
    @NotNull(message = "Order items are required")
    @NotEmpty(message = "Order must have at least one item")
    private List<OrderItemRequest> items;

    private String notes;

    // ─── Constructors ────────────────────────────────────────────────────────

    public OrderRequest() {
    }

    public OrderRequest(String customerId, List<OrderItemRequest> items, String notes) {
        this.customerId = customerId;
        this.items = items;
        this.notes = notes;
    }

    // ─── Getters ─────────────────────────────────────────────────────────────

    public String getCustomerId() {
        return customerId;
    }

    public List<OrderItemRequest> getItems() {
        return items;
    }

    public String getNotes() {
        return notes;
    }

    // ─── Setters ─────────────────────────────────────────────────────────────

    public void setCustomerId(String customerId) {
        this.customerId = customerId;
    }

    public void setItems(List<OrderItemRequest> items) {
        this.items = items;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    // ─── Builder ──────────────────────────────────────────────────────────────

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String customerId;
        private List<OrderItemRequest> items;
        private String notes;

        private Builder() {
        }

        public Builder customerId(String customerId) {
            this.customerId = customerId;
            return this;
        }

        public Builder items(List<OrderItemRequest> items) {
            this.items = items;
            return this;
        }

        public Builder notes(String notes) {
            this.notes = notes;
            return this;
        }

        public OrderRequest build() {
            return new OrderRequest(customerId, items, notes);
        }
    }

    // ─── Inner DTO ────────────────────────────────────────────────────────────

    /**
     * Inner DTO for each item in the order.
     * Client provides productId + quantity only.
     * Price is fetched from the Product document by the service.
     */
    public static class OrderItemRequest {

        @NotBlank(message = "Product ID is required for each item")
        private String productId;

        @NotNull(message = "Quantity is required")
        @Min(value = 1, message = "Quantity must be at least 1")
        private Integer quantity;

        // Constructors

        public OrderItemRequest() {
        }

        public OrderItemRequest(String productId, Integer quantity) {
            this.productId = productId;
            this.quantity = quantity;
        }

        // Getters

        public String getProductId() {
            return productId;
        }

        public Integer getQuantity() {
            return quantity;
        }

        // Setters

        public void setProductId(String productId) {
            this.productId = productId;
        }

        public void setQuantity(Integer quantity) {
            this.quantity = quantity;
        }

        // Builder

        public static OrderItemRequestBuilder builder() {
            return new OrderItemRequestBuilder();
        }

        public static class OrderItemRequestBuilder {
            private String productId;
            private Integer quantity;

            private OrderItemRequestBuilder() {
            }

            public OrderItemRequestBuilder productId(String productId) {
                this.productId = productId;
                return this;
            }

            public OrderItemRequestBuilder quantity(Integer quantity) {
                this.quantity = quantity;
                return this;
            }

            public OrderItemRequest build() {
                return new OrderItemRequest(productId, quantity);
            }
        }
    }
}
