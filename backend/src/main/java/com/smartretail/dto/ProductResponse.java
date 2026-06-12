package com.smartretail.dto;

import java.time.LocalDateTime;

/**
 * ============================================================
 * ProductResponse DTO - Outgoing API response for Product data.
 * ============================================================
 *
 * Enriched with category and supplier names (not just IDs)
 * so the frontend can display them directly.
 *
 * Example response:
 * {
 *   "id": "64f1...",
 *   "name": "iPhone 15 Pro",
 *   "price": 129999.00,
 *   "stockQuantity": 50,
 *   "categoryId": "64f2...",
 *   "categoryName": "Electronics",     ← Enriched field
 *   "supplierId": "64f3...",
 *   "supplierName": "Apple Inc.",      ← Enriched field
 *   "isLowStock": false,               ← Computed field
 *   ...
 * }
 * ============================================================
 */
public class ProductResponse {

    private String id;
    private String name;
    private String description;
    private Double price;
    private Integer stockQuantity;
    private String brand;
    private String status;

    /** Category ID reference */
    private String categoryId;
    /** Category name — fetched and added by the service layer */
    private String categoryName;

    /** Supplier ID reference */
    private String supplierId;
    /** Supplier name — fetched and added by the service layer */
    private String supplierName;

    /**
     * Computed field: true if stock < low-stock threshold (default: 10)
     * Used by the dashboard to show Low Stock Alerts.
     */
    private boolean lowStock;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // ─── Constructors ────────────────────────────────────────────────────────

    public ProductResponse() {
    }

    public ProductResponse(String id, String name, String description, Double price,
                           Integer stockQuantity, String brand, String status,
                           String categoryId, String categoryName,
                           String supplierId, String supplierName,
                           boolean lowStock, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.stockQuantity = stockQuantity;
        this.brand = brand;
        this.status = status;
        this.categoryId = categoryId;
        this.categoryName = categoryName;
        this.supplierId = supplierId;
        this.supplierName = supplierName;
        this.lowStock = lowStock;
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

    public String getStatus() {
        return status;
    }

    public String getCategoryId() {
        return categoryId;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public String getSupplierId() {
        return supplierId;
    }

    public String getSupplierName() {
        return supplierName;
    }

    public boolean isLowStock() {
        return lowStock;
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

    public void setStatus(String status) {
        this.status = status;
    }

    public void setCategoryId(String categoryId) {
        this.categoryId = categoryId;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public void setSupplierId(String supplierId) {
        this.supplierId = supplierId;
    }

    public void setSupplierName(String supplierName) {
        this.supplierName = supplierName;
    }

    public void setLowStock(boolean lowStock) {
        this.lowStock = lowStock;
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
        private String status;
        private String categoryId;
        private String categoryName;
        private String supplierId;
        private String supplierName;
        private boolean lowStock;
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

        public Builder status(String status) {
            this.status = status;
            return this;
        }

        public Builder categoryId(String categoryId) {
            this.categoryId = categoryId;
            return this;
        }

        public Builder categoryName(String categoryName) {
            this.categoryName = categoryName;
            return this;
        }

        public Builder supplierId(String supplierId) {
            this.supplierId = supplierId;
            return this;
        }

        public Builder supplierName(String supplierName) {
            this.supplierName = supplierName;
            return this;
        }

        public Builder lowStock(boolean lowStock) {
            this.lowStock = lowStock;
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

        public ProductResponse build() {
            return new ProductResponse(id, name, description, price, stockQuantity, brand, status,
                    categoryId, categoryName, supplierId, supplierName, lowStock, createdAt, updatedAt);
        }
    }
}
