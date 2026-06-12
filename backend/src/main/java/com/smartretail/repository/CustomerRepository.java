package com.smartretail.repository;

import com.smartretail.model.Customer;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * ============================================================
 * CustomerRepository - Database Access Layer for Customers
 * ============================================================
 */
@Repository
public interface CustomerRepository extends MongoRepository<Customer, String> {

    /** Find customer by email (unique field) */
    Optional<Customer> findByEmail(String email);

    /** Check if email is already registered */
    boolean existsByEmail(String email);

    /** Check email is not used by another customer (for updates) */
    boolean existsByEmailAndIdNot(String email, String id);

    /** Find customer by phone number */
    Optional<Customer> findByPhone(String phone);

    /**
     * Search customers by name (partial, case-insensitive).
     * MongoDB query: db.customers.find({ name: { $regex: "rahul", $options: "i" } })
     */
    List<Customer> findByNameContainingIgnoreCase(String name);

    /**
     * Search customers by city in their embedded address.
     * Dot notation accesses nested document fields in MongoDB.
     * MongoDB query: db.customers.find({ "address.city": "Mumbai" })
     */
    List<Customer> findByAddressCity(String city);
}
