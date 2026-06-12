package com.smartretail.dto;

import jakarta.validation.constraints.Size;

/**
 * ============================================================
 * StockUpdateRequest DTO - For Inventory Stock Updates
 * ============================================================
 *
 * Used when updating just the stock quantity of a product
 * without changing other product details.
 *
 * Example request:
 * {
 *   "stockQuantity": 100,
 *   "reason": "New shipment received from supplier"
 * }
 * ============================================================
 */
public class StockUpdateRequest {

    /** New stock quantity to set */
    private Integer stockQuantity;

    /** Reason for the stock update (for audit purposes) */
    @Size(max = 500, message = "Reason cannot exceed 500 characters")
    private String reason;

    // ─── Constructors ────────────────────────────────────────────────────────

    public StockUpdateRequest() {
    }

    public StockUpdateRequest(Integer stockQuantity, String reason) {
        this.stockQuantity = stockQuantity;
        this.reason = reason;
    }

    // ─── Getters ─────────────────────────────────────────────────────────────

    public Integer getStockQuantity() {
        return stockQuantity;
    }

    public String getReason() {
        return reason;
    }

    // ─── Setters ─────────────────────────────────────────────────────────────

    public void setStockQuantity(Integer stockQuantity) {
        this.stockQuantity = stockQuantity;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    // ─── Builder ──────────────────────────────────────────────────────────────

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Integer stockQuantity;
        private String reason;

        private Builder() {
        }

        public Builder stockQuantity(Integer stockQuantity) {
            this.stockQuantity = stockQuantity;
            return this;
        }

        public Builder reason(String reason) {
            this.reason = reason;
            return this;
        }

        public StockUpdateRequest build() {
            return new StockUpdateRequest(stockQuantity, reason);
        }
    }
}
