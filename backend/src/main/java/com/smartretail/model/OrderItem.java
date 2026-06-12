package com.smartretail.model;

/**
 * ============================================================
 * OrderItem - Embedded Document (Not a Collection)
 * ============================================================
 *
 * Represents a single product line-item within an Order.
 * Each order can have multiple products with different quantities.
 *
 * MANY-TO-MANY RELATIONSHIP:
 *   Orders ↔ Products
 *   - One Order can contain many Products
 *   - One Product can appear in many Orders
 *
 * HOW MANY-TO-MANY IS MODELED IN MONGODB:
 *   Instead of a JOIN table (like in SQL), we use an embedded list.
 *   Each Order document contains a List<OrderItem> where each
 *   OrderItem stores the productId + quantity + price at time of order.
 *
 * WHY store price here?
 *   If a product's price changes later, we need to remember
 *   what price was charged at the time of this specific order.
 *   This is called "price snapshot" pattern.
 *
 * MongoDB Order document example:
 * {
 *   "_id": "64f1...",
 *   "customerId": "64f2...",
 *   "items": [                        ← List of OrderItems
 *     {
 *       "productId": "64f3...",
 *       "productName": "iPhone 15",
 *       "quantity": 2,
 *       "unitPrice": 79999.00,
 *       "subtotal": 159998.00
 *     },
 *     {
 *       "productId": "64f4...",
 *       "productName": "AirPods Pro",
 *       "quantity": 1,
 *       "unitPrice": 24999.00,
 *       "subtotal": 24999.00
 *     }
 *   ],
 *   "totalAmount": 184997.00
 * }
 * ============================================================
 */
public class OrderItem {

    /**
     * Reference to the Product document.
     * This is the Many-to-Many relationship link.
     */
    private String productId;

    /**
     * Snapshot of product name at time of order.
     * Stored here so order history remains accurate
     * even if the product name changes later.
     */
    private String productName;

    /** Number of units ordered */
    private Integer quantity;

    /**
     * Price per unit AT THE TIME OF THE ORDER.
     * This is the "price snapshot" — avoids issues if
     * product price changes after order is placed.
     */
    private Double unitPrice;

    /**
     * Calculated field: quantity × unitPrice
     * Stored for fast display without recalculation.
     */
    private Double subtotal;

    // ─── Constructors ────────────────────────────────────────────────────────

    public OrderItem() {
    }

    public OrderItem(String productId, String productName, Integer quantity, Double unitPrice, Double subtotal) {
        this.productId = productId;
        this.productName = productName;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
        this.subtotal = subtotal;
    }

    // ─── Getters ─────────────────────────────────────────────────────────────

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

    // ─── Setters ─────────────────────────────────────────────────────────────

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

    // ─── Builder ──────────────────────────────────────────────────────────────

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String productId;
        private String productName;
        private Integer quantity;
        private Double unitPrice;
        private Double subtotal;

        private Builder() {
        }

        public Builder productId(String productId) {
            this.productId = productId;
            return this;
        }

        public Builder productName(String productName) {
            this.productName = productName;
            return this;
        }

        public Builder quantity(Integer quantity) {
            this.quantity = quantity;
            return this;
        }

        public Builder unitPrice(Double unitPrice) {
            this.unitPrice = unitPrice;
            return this;
        }

        public Builder subtotal(Double subtotal) {
            this.subtotal = subtotal;
            return this;
        }

        public OrderItem build() {
            return new OrderItem(productId, productName, quantity, unitPrice, subtotal);
        }
    }
}
