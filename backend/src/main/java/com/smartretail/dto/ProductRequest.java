package com.smartretail.dto;

import jakarta.validation.constraints.*;

/**
 * ============================================================
 * ProductRequest DTO - Incoming Data for Create/Update Product
 * ============================================================
 *
 * Example request JSON:
 * {
 *   "name": "iPhone 15 Pro",
 *   "description": "Apple flagship smartphone",
 *   "price": 129999.00,
 *   "stockQuantity": 50,
 *   "brand": "Apple",
 *   "categoryId": "64f1a2b3c4d5e6f7a8b9c0d1",
 *   "supplierId": "64f1a2b4c4d5e6f7a8b9c0d2",
 *   "status": "ACTIVE"
 * }
 * ============================================================
 */
public class ProductRequest {

    @NotBlank(message = "Product name is required")
    @Size(min = 2, max = 200, message = "Product name must be between 2 and 200 characters")
    private String name;

    @Size(max = 1000, message = "Description cannot exceed 1000 characters")
    private String description;

    /**
     * @NotNull: Must be provided (but can be 0).
     * @DecimalMin: Minimum value is 0.0 (price can't be negative).
     * inclusive = false: price must be > 0.01
     */
    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.01", message = "Price must be greater than 0")
    private Double price;

    /**
     * @NotNull: Stock quantity must be provided.
     * @Min(0): Stock cannot be negative.
     */
    @NotNull(message = "Stock quantity is required")
    @Min(value = 0, message = "Stock quantity cannot be negative")
    private Integer stockQuantity;

    @Size(max = 100, message = "Brand name cannot exceed 100 characters")
    private String brand;

    /** ID of the Category this product belongs to */
    @NotBlank(message = "Category ID is required")
    private String categoryId;

    /** ID of the Supplier for this product */
    private String supplierId;

    /**
     * Must be one of: ACTIVE, INACTIVE, OUT_OF_STOCK
     * Validated in the service layer.
     */
    private String status;

    // ─── Constructors ────────────────────────────────────────────────────────

    public ProductRequest() {
    }

    public ProductRequest(String name, String description, Double price, Integer stockQuantity,
                          String brand, String categoryId, String supplierId, String status) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.stockQuantity = stockQuantity;
        this.brand = brand;
        this.categoryId = categoryId;
        this.supplierId = supplierId;
        this.status = status;
    }

    // ─── Getters ─────────────────────────────────────────────────────────────

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

    // ─── Setters ─────────────────────────────────────────────────────────────

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

    // ─── Builder ──────────────────────────────────────────────────────────────

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String name;
        private String description;
        private Double price;
        private Integer stockQuantity;
        private String brand;
        private String categoryId;
        private String supplierId;
        private String status;

        private Builder() {
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

        public ProductRequest build() {
            return new ProductRequest(name, description, price, stockQuantity, brand, categoryId, supplierId, status);
        }
    }
}
