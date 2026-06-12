package com.smartretail.model;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

/**
 * ============================================================
 * Product Model - MongoDB Document
 * ============================================================
 *
 * Core entity of the system. Represents a product in the store.
 *
 * RELATIONSHIPS:
 *   - Belongs to ONE Category (One-to-Many: Category → Products)
 *   - Belongs to ONE Supplier (One-to-Many: Supplier → Products)
 *   - Appears in MANY Orders (Many-to-Many: Orders ↔ Products)
 *
 * HOW RELATIONSHIPS WORK IN MONGODB:
 *   MongoDB is a document database, not a relational database.
 *   Instead of JOIN tables, we store the ID of related documents.
 *
 *   categoryId: "64f1a2b3..." ← ID of the Category document
 *   supplierId: "64f1a2b4..." ← ID of the Supplier document
 *
 *   When we need the full Category object, we look it up using categoryId.
 *   This is called "referencing" (as opposed to "embedding").
 *
 * MongoDB Collection: "products"
 * ============================================================
 */
@Document(collection = "products")
public class Product {

    @Id
    private String id;

    /** Product display name */
    @Indexed
    private String name;

    /** Detailed product description */
    private String description;

    /** Selling price of the product */
    private Double price;

    /**
     * Current stock quantity.
     * When this falls below the threshold (default: 10),
     * the product is flagged as "Low Stock" in the dashboard.
     */
    private Integer stockQuantity;

    /** Brand name (e.g., "Apple", "Samsung", "Nike") */
    private String brand;

    /**
     * ONE-TO-MANY RELATIONSHIP (Child side):
     * Stores the Category document's ID.
     * One Category can have many Products.
     *
     * Example: categoryId = "64f1a2b3c4d5e6f7a8b9c0d1"
     *          → Refers to Category document with that _id
     */
    private String categoryId;

    /**
     * ONE-TO-MANY RELATIONSHIP (Child side):
     * Stores the Supplier document's ID.
     * One Supplier can supply many Products.
     */
    private String supplierId;

    /**
     * Product status options:
     * - "ACTIVE"      → Available for ordering
     * - "INACTIVE"    → Discontinued or hidden
     * - "OUT_OF_STOCK" → Automatically set when stock = 0
     */
    private String status;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    // ─── Constructors ────────────────────────────────────────────────────────

    public Product() {
    }

    public Product(String id, String name, String description, Double price, Integer stockQuantity,
                   String brand, String categoryId, String supplierId, String status,
                   LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.stockQuantity = stockQuantity;
        this.brand = brand;
        this.categoryId = categoryId;
        this.supplierId = supplierId;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // ─── Getters ─────────────────────────────────────────────────────────────

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public Double getPrice() {
        return price;
    }

    public Integer getStockQuantity() {
        return stockQuantity;
    }

    public String getBrand() {
        return brand;
    }

    public String getCategoryId() {
        return categoryId;
    }

    public String getSupplierId() {
        return supplierId;
    }

    public String getStatus() {
        return status;
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

    public void setName(String name) {
        this.name = name;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public void setStockQuantity(Integer stockQuantity) {
        this.stockQuantity = stockQuantity;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public void setCategoryId(String categoryId) {
        this.categoryId = categoryId;
    }

    public void setSupplierId(String supplierId) {
        this.supplierId = supplierId;
    }

    public void setStatus(String status) {
        this.status = status;
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
        private String name;
        private String description;
        private Double price;
        private Integer stockQuantity;
        private String brand;
        private String categoryId;
        private String supplierId;
        private String status;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        private Builder() {
        }

        public Builder id(String id) {
            this.id = id;
            return this;
        }

        public Builder name(String name) {
            this.name = name;
            return this;
        }

        public Builder description(String description) {
            this.description = description;
            return this;
        }

        public Builder price(Double price) {
            this.price = price;
            return this;
        }

        public Builder stockQuantity(Integer stockQuantity) {
            this.stockQuantity = stockQuantity;
            return this;
        }

        public Builder brand(String brand) {
            this.brand = brand;
            return this;
        }

        public Builder categoryId(String categoryId) {
            this.categoryId = categoryId;
            return this;
        }

        public Builder supplierId(String supplierId) {
            this.supplierId = supplierId;
            return this;
        }

        public Builder status(String status) {
            this.status = status;
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

        public Product build() {
            return new Product(id, name, description, price, stockQuantity, brand,
                    categoryId, supplierId, status, createdAt, updatedAt);
        }
    }
}
