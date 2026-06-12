package com.smartretail.repository;

import com.smartretail.model.Product;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * ============================================================
 * ProductRepository - Database Access Layer for Products
 * ============================================================
 *
 * Contains methods for:
 * - Finding products by category or supplier (for relationships)
 * - Finding low-stock products (for inventory alerts)
 * - Searching products by name (for search functionality)
 * ============================================================
 */
@Repository
public interface ProductRepository extends MongoRepository<Product, String> {

    /**
     * ONE-TO-MANY: Find all products belonging to a category.
     * Used when displaying products filtered by category.
     *
     * MongoDB query: db.products.find({ categoryId: "64f1..." })
     */
    List<Product> findByCategoryId(String categoryId);

    /**
     * ONE-TO-MANY: Find all products supplied by a supplier.
     * Used when displaying products filtered by supplier.
     *
     * MongoDB query: db.products.find({ supplierId: "64f2..." })
     */
    List<Product> findBySupplierId(String supplierId);

    /**
     * INVENTORY ALERT: Find products with stock below threshold.
     * LessThan is a Spring Data keyword that translates to $lt operator.
     *
     * MongoDB query: db.products.find({ stockQuantity: { $lt: 10 } })
     */
    List<Product> findByStockQuantityLessThan(int threshold);

    /**
     * SEARCH: Find products whose name contains the search term.
     * IgnoreCase makes the search case-insensitive.
     *
     * MongoDB query: db.products.find({ name: { $regex: "iphone", $options: "i" } })
     */
    List<Product> findByNameContainingIgnoreCase(String name);

    /**
     * Filter products by status (ACTIVE, INACTIVE, OUT_OF_STOCK).
     * MongoDB query: db.products.find({ status: "ACTIVE" })
     */
    List<Product> findByStatus(String status);

    /**
     * Filter products by category AND status combined.
     * MongoDB query: db.products.find({ categoryId: "64f1...", status: "ACTIVE" })
     */
    List<Product> findByCategoryIdAndStatus(String categoryId, String status);

    /**
     * Count products in a category (used in dashboard).
     * MongoDB query: db.products.countDocuments({ categoryId: "64f1..." })
     */
    long countByCategoryId(String categoryId);

    /**
     * Count products with stock below threshold (dashboard alert count).
     * MongoDB query: db.products.countDocuments({ stockQuantity: { $lt: 10 } })
     */
    long countByStockQuantityLessThan(int threshold);
}
