package com.smartretail.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 * ============================================================
 * Address Model - MongoDB Embedded Document
 * ============================================================
 *
 * Represents a physical address.
 *
 * RELATIONSHIP: One-to-One with Customer
 *
 * HOW IT'S STORED (Embedded Document Pattern):
 *   Instead of a separate "addresses" collection, the address
 *   is EMBEDDED inside the Customer document.
 *
 *   MongoDB Customer document example:
 *   {
 *     "_id": "64f1...",
 *     "name": "John Doe",
 *     "email": "john@example.com",
 *     "address": {                  ← EMBEDDED Address object
 *       "street": "123 Main St",
 *       "city": "Mumbai",
 *       "state": "Maharashtra",
 *       "pincode": "400001",
 *       "country": "India"
 *     }
 *   }
 *
 * WHY EMBED instead of a separate collection?
 *   - A customer always has ONE address
 *   - Retrieving customer + address in ONE query is faster
 *   - No JOIN needed (MongoDB doesn't support joins like SQL)
 *   - This is the "embedding" pattern (vs. "referencing" pattern)
 *
 * NOTE: No @Document annotation here because Address is embedded,
 *       not stored in its own collection.
 * ============================================================
 */
public class Address {

    /** Unique ID for the address (used if Address is ever stored separately) */
    @Id
    private String id;

    /** Street address line (e.g., "123 Main Street, Apt 4B") */
    private String street;

    /** City name (e.g., "Mumbai", "Delhi", "Bangalore") */
    private String city;

    /** State or province (e.g., "Maharashtra", "Karnataka") */
    private String state;

    /** Postal/PIN code (e.g., "400001") */
    private String pincode;

    /** Country name (e.g., "India", "USA") */
    private String country;

    // ─── Constructors ────────────────────────────────────────────────────────

    public Address() {
    }

    public Address(String id, String street, String city, String state, String pincode, String country) {
        this.id = id;
        this.street = street;
        this.city = city;
        this.state = state;
        this.pincode = pincode;
        this.country = country;
    }

    // ─── Getters ─────────────────────────────────────────────────────────────

    public String getId() {
        return id;
    }

    public String getStreet() {
        return street;
    }

    public String getCity() {
        return city;
    }

    public String getState() {
        return state;
    }

    public String getPincode() {
        return pincode;
    }

    public String getCountry() {
        return country;
    }

    // ─── Setters ─────────────────────────────────────────────────────────────

    public void setId(String id) {
        this.id = id;
    }

    public void setStreet(String street) {
        this.street = street;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public void setState(String state) {
        this.state = state;
    }

    public void setPincode(String pincode) {
        this.pincode = pincode;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    // ─── Builder ──────────────────────────────────────────────────────────────

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String id;
        private String street;
        private String city;
        private String state;
        private String pincode;
        private String country;

        private Builder() {
        }

        public Builder id(String id) {
            this.id = id;
            return this;
        }

        public Builder street(String street) {
            this.street = street;
            return this;
        }

        public Builder city(String city) {
            this.city = city;
            return this;
        }

        public Builder state(String state) {
            this.state = state;
            return this;
        }

        public Builder pincode(String pincode) {
            this.pincode = pincode;
            return this;
        }

        public Builder country(String country) {
            this.country = country;
            return this;
        }

        public Address build() {
            return new Address(id, street, city, state, pincode, country);
        }
    }
}
