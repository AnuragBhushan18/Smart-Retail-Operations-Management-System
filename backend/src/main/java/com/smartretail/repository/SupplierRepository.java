package com.smartretail.repository;

import com.smartretail.model.Supplier;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * ============================================================
 * SupplierRepository - Database Access Layer for Suppliers
 * ============================================================
 */
@Repository
public interface SupplierRepository extends MongoRepository<Supplier, String> {

    /** Find supplier by email (for login or duplicate check) */
    Optional<Supplier> findByEmail(String email);

    /** Check if an email is already registered */
    boolean existsByEmail(String email);

    /** Check if email is taken by another supplier (for updates) */
    boolean existsByEmailAndIdNot(String email, String id);

    /** Find supplier by contact number */
    Optional<Supplier> findByContactNumber(String contactNumber);
}
