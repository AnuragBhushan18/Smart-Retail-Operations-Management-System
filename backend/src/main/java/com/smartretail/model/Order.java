package com.smartretail.model;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

/**
 * ============================================================
 * Order Model - MongoDB Document
 * ============================================================
 *
 * Represents a customer order in the retail system.
 *
 * RELATIONSHIPS:
 *   - MANY-TO-MANY with Products (via embedded List<OrderItem>)
 *   - MANY-TO-ONE with Customer (via customerId reference)
 *
 * ORDER STATUS LIFECYCLE:
 *   PENDING → CONFIRMED → SHIPPED → DELIVERED
 *                     ↘ CANCELLED
 *
 * MongoDB Collection: "orders"
 * ============================================================
 */
@Document(collection = "orders")
public class Order {

    @Id
    private String id;

    /**
     * MANY-TO-ONE RELATIONSHIP:
     * Reference to the Customer who placed this order.
     * Many orders can belong to one customer.
     */
    private String customerId;

    /** Snapshot of customer name at time of order */
    private String customerName;

    /**
     * MANY-TO-MANY RELATIONSHIP:
     * List of products in this order, each with quantity and price.
     * Using embedded OrderItem documents (not a separate collection).
     *
     * This is how MongoDB models Many-to-Many:
     *   Order contains a list of {productId, quantity, price} items.
     */
    private List<OrderItem> items;

    /** Date and time when the order was placed */
    private LocalDateTime orderDate;

    /**
     * Sum of all item subtotals.
     * Formula: Σ (item.quantity × item.unitPrice)
     */
    private Double totalAmount;

    /**
     * Current order status.
     * Using String for flexibility (could also use an Enum).
     * Valid values: PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED
     */
    private String status;

    /** Optional notes for the order (e.g., delivery instructions) */
    private String notes;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    // ─── Constructors ────────────────────────────────────────────────────────

    public Order() {
    }

    public Order(String id, String customerId, String customerName, List<OrderItem> items,
                 LocalDateTime orderDate, Double totalAmount, String status, String notes,
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

    public List<OrderItem> getItems() {
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

    public void setItems(List<OrderItem> items) {
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
        private List<OrderItem> items;
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

        public Builder items(List<OrderItem> items) {
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

        public Order build() {
            return new Order(id, customerId, customerName, items, orderDate,
                    totalAmount, status, notes, createdAt, updatedAt);
        }
    }
}
