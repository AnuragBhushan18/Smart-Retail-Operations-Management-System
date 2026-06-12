package com.smartretail.repository;

import com.smartretail.model.Admin;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * AdminRepository - Database Access Layer for Admin accounts.
 */
@Repository
public interface AdminRepository extends MongoRepository<Admin, String> {

    /** Find admin by username (for login) */
    Optional<Admin> findByUsername(String username);

    /** Find admin by email (alternate login method) */
    Optional<Admin> findByEmail(String email);

    /** Check if username is taken */
    boolean existsByUsername(String username);

    /** Check if email is registered */
    boolean existsByEmail(String email);
}
