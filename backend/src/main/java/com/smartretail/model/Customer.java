package com.smartretail.model;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

/**
 * ============================================================
 * Customer Model - MongoDB Document
 * ============================================================
 *
 * Represents a customer in the retail system.
 *
 * RELATIONSHIP: One-to-One with Address
 *   The Address is EMBEDDED directly inside this Customer document.
 *   No separate "addresses" collection — address lives inside Customer.
 *
 * MongoDB Collection: "customers"
 *
 * STORED DOCUMENT EXAMPLE:
 * {
 *   "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
 *   "name": "Rahul Sharma",
 *   "phone": "9876543210",
 *   "email": "rahul@example.com",
 *   "address": {
 *     "street": "42 MG Road",
 *     "city": "Bangalore",
 *     "state": "Karnataka",
 *     "pincode": "560001",
 *     "country": "India"
 *   },
 *   "createdAt": "2024-01-01T10:00:00",
 *   "updatedAt": "2024-01-01T10:00:00"
 * }
 * ============================================================
 */
@Document(collection = "customers")
public class Customer {

    @Id
    private String id;

    /** Customer full name */
    private String name;

    /** Mobile/Phone number */
    @Indexed
    private String phone;

    /** Email address - must be unique */
    @Indexed(unique = true)
    private String email;

    /**
     * ONE-TO-ONE RELATIONSHIP (Embedded):
     * Address object is stored INSIDE this Customer document.
     * Not a reference/ID — the full Address object is embedded.
     *
     * This demonstrates the "embedding" relationship pattern in MongoDB.
     */
    private Address address;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    // ─── Constructors ────────────────────────────────────────────────────────

    public Customer() {
    }

    public Customer(String id, String name, String phone, String email, Address address,
                    LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.name = name;
        this.phone = phone;
        this.email = email;
        this.address = address;
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

    public String getPhone() {
        return phone;
    }

    public String getEmail() {
        return email;
    }

    public Address getAddress() {
        return address;
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

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setAddress(Address address) {
        this.address = address;
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
        private String phone;
        private String email;
        private Address address;
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

        public Builder phone(String phone) {
            this.phone = phone;
            return this;
        }

        public Builder email(String email) {
            this.email = email;
            return this;
        }

        public Builder address(Address address) {
            this.address = address;
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

        public Customer build() {
            return new Customer(id, name, phone, email, address, createdAt, updatedAt);
        }
    }
}
