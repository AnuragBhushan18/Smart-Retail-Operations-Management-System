package com.smartretail.repository;

import com.smartretail.model.Order;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * ============================================================
 * OrderRepository - Database Access Layer for Orders
 * ============================================================
 */
@Repository
public interface OrderRepository extends MongoRepository<Order, String> {

    /**
     * Find all orders placed by a specific customer.
     * MongoDB query: db.orders.find({ customerId: "64f1..." })
     */
    List<Order> findByCustomerId(String customerId);

    /**
     * Find all orders with a specific status.
     * MongoDB query: db.orders.find({ status: "PENDING" })
     */
    List<Order> findByStatus(String status);

    /**
     * Count orders by status (used in dashboard analytics).
     * MongoDB query: db.orders.countDocuments({ status: "PENDING" })
     */
    long countByStatus(String status);

    /**
     * Find orders placed within a date range.
     * Between translates to: $gte (greater than or equal) and $lte
     * MongoDB query: db.orders.find({ orderDate: { $gte: start, $lte: end } })
     */
    List<Order> findByOrderDateBetween(LocalDateTime start, LocalDateTime end);

    /**
     * Search orders by customer name (partial match, case-insensitive).
     * Used in the order search functionality.
     */
    List<Order> findByCustomerNameContainingIgnoreCase(String customerName);

    /**
     * Find orders by customer AND status combined.
     */
    List<Order> findByCustomerIdAndStatus(String customerId, String status);
}
