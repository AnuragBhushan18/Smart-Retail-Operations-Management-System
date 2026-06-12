package com.smartretail.dto;

import java.util.List;

/**
 * ============================================================
 * DashboardResponse DTO - Analytics data for the dashboard page
 * ============================================================
 *
 * Aggregates statistics from all modules into one response.
 * Used by the React dashboard page.
 *
 * Example response:
 * {
 *   "totalProducts": 150,
 *   "totalCategories": 12,
 *   "totalSuppliers": 8,
 *   "totalCustomers": 320,
 *   "totalOrders": 540,
 *   "pendingOrders": 24,
 *   "lowStockProducts": [...],
 *   "lowStockCount": 5
 * }
 * ============================================================
 */
public class DashboardResponse {

    /** Total number of products in the system */
    private long totalProducts;

    /** Total number of categories */
    private long totalCategories;

    /** Total number of suppliers */
    private long totalSuppliers;

    /** Total number of customers */
    private long totalCustomers;

    /** Total number of orders ever placed */
    private long totalOrders;

    /** Orders with PENDING status */
    private long pendingOrders;

    /** Orders with CONFIRMED status */
    private long confirmedOrders;

    /** Orders with SHIPPED status */
    private long shippedOrders;

    /** Orders with DELIVERED status */
    private long deliveredOrders;

    /** Products below the low-stock threshold */
    private List<ProductResponse> lowStockProducts;

    /** Count of low-stock products */
    private long lowStockCount;

    /** Total inventory value (sum of price × stock for all products) */
    private Double totalInventoryValue;

    // ─── Constructors ────────────────────────────────────────────────────────

    public DashboardResponse() {
    }

    public DashboardResponse(long totalProducts, long totalCategories, long totalSuppliers,
                             long totalCustomers, long totalOrders, long pendingOrders,
                             long confirmedOrders, long shippedOrders, long deliveredOrders,
                             List<ProductResponse> lowStockProducts, long lowStockCount,
                             Double totalInventoryValue) {
        this.totalProducts = totalProducts;
        this.totalCategories = totalCategories;
        this.totalSuppliers = totalSuppliers;
        this.totalCustomers = totalCustomers;
        this.totalOrders = totalOrders;
        this.pendingOrders = pendingOrders;
        this.confirmedOrders = confirmedOrders;
        this.shippedOrders = shippedOrders;
        this.deliveredOrders = deliveredOrders;
        this.lowStockProducts = lowStockProducts;
        this.lowStockCount = lowStockCount;
        this.totalInventoryValue = totalInventoryValue;
    }

    // ─── Getters ─────────────────────────────────────────────────────────────

    public long getTotalProducts() {
        return totalProducts;
    }

    public long getTotalCategories() {
        return totalCategories;
    }

    public long getTotalSuppliers() {
        return totalSuppliers;
    }

    public long getTotalCustomers() {
        return totalCustomers;
    }

    public long getTotalOrders() {
        return totalOrders;
    }

    public long getPendingOrders() {
        return pendingOrders;
    }

    public long getConfirmedOrders() {
        return confirmedOrders;
    }

    public long getShippedOrders() {
        return shippedOrders;
    }

    public long getDeliveredOrders() {
        return deliveredOrders;
    }

    public List<ProductResponse> getLowStockProducts() {
        return lowStockProducts;
    }

    public long getLowStockCount() {
        return lowStockCount;
    }

    public Double getTotalInventoryValue() {
        return totalInventoryValue;
    }

    // ─── Setters ─────────────────────────────────────────────────────────────

    public void setTotalProducts(long totalProducts) {
        this.totalProducts = totalProducts;
    }

    public void setTotalCategories(long totalCategories) {
        this.totalCategories = totalCategories;
    }

    public void setTotalSuppliers(long totalSuppliers) {
        this.totalSuppliers = totalSuppliers;
    }

    public void setTotalCustomers(long totalCustomers) {
        this.totalCustomers = totalCustomers;
    }

    public void setTotalOrders(long totalOrders) {
        this.totalOrders = totalOrders;
    }

    public void setPendingOrders(long pendingOrders) {
        this.pendingOrders = pendingOrders;
    }

    public void setConfirmedOrders(long confirmedOrders) {
        this.confirmedOrders = confirmedOrders;
    }

    public void setShippedOrders(long shippedOrders) {
        this.shippedOrders = shippedOrders;
    }

    public void setDeliveredOrders(long deliveredOrders) {
        this.deliveredOrders = deliveredOrders;
    }

    public void setLowStockProducts(List<ProductResponse> lowStockProducts) {
        this.lowStockProducts = lowStockProducts;
    }

    public void setLowStockCount(long lowStockCount) {
        this.lowStockCount = lowStockCount;
    }

    public void setTotalInventoryValue(Double totalInventoryValue) {
        this.totalInventoryValue = totalInventoryValue;
    }

    // ─── Builder ──────────────────────────────────────────────────────────────

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private long totalProducts;
        private long totalCategories;
        private long totalSuppliers;
        private long totalCustomers;
        private long totalOrders;
        private long pendingOrders;
        private long confirmedOrders;
        private long shippedOrders;
        private long deliveredOrders;
        private List<ProductResponse> lowStockProducts;
        private long lowStockCount;
        private Double totalInventoryValue;

        private Builder() {
        }

        public Builder totalProducts(long totalProducts) {
            this.totalProducts = totalProducts;
            return this;
        }

        public Builder totalCategories(long totalCategories) {
            this.totalCategories = totalCategories;
            return this;
        }

        public Builder totalSuppliers(long totalSuppliers) {
            this.totalSuppliers = totalSuppliers;
            return this;
        }

        public Builder totalCustomers(long totalCustomers) {
            this.totalCustomers = totalCustomers;
            return this;
        }

        public Builder totalOrders(long totalOrders) {
            this.totalOrders = totalOrders;
            return this;
        }

        public Builder pendingOrders(long pendingOrders) {
            this.pendingOrders = pendingOrders;
            return this;
        }

        public Builder confirmedOrders(long confirmedOrders) {
            this.confirmedOrders = confirmedOrders;
            return this;
        }

        public Builder shippedOrders(long shippedOrders) {
            this.shippedOrders = shippedOrders;
            return this;
        }

        public Builder deliveredOrders(long deliveredOrders) {
            this.deliveredOrders = deliveredOrders;
            return this;
        }

        public Builder lowStockProducts(List<ProductResponse> lowStockProducts) {
            this.lowStockProducts = lowStockProducts;
            return this;
        }

        public Builder lowStockCount(long lowStockCount) {
            this.lowStockCount = lowStockCount;
            return this;
        }

        public Builder totalInventoryValue(Double totalInventoryValue) {
            this.totalInventoryValue = totalInventoryValue;
            return this;
        }

        public DashboardResponse build() {
            return new DashboardResponse(totalProducts, totalCategories, totalSuppliers,
                    totalCustomers, totalOrders, pendingOrders, confirmedOrders,
                    shippedOrders, deliveredOrders, lowStockProducts, lowStockCount,
                    totalInventoryValue);
        }
    }
}
