package com.smartretail.dto;

import java.time.LocalDateTime;

/**
 * CustomerResponse DTO - Outgoing API response for Customer data.
 * Includes the embedded address as a nested object.
 */
public class CustomerResponse {

    private String id;
    private String name;
    private String phone;
    private String email;

    /** Nested address object returned in the response */
    private AddressResponse address;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // ─── Constructors ────────────────────────────────────────────────────────

    public CustomerResponse() {
    }

    public CustomerResponse(String id, String name, String phone, String email,
                            AddressResponse address, LocalDateTime createdAt, LocalDateTime updatedAt) {
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

    public AddressResponse getAddress() {
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

    public void setAddress(AddressResponse address) {
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
        private AddressResponse address;
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

        public Builder address(AddressResponse address) {
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

        public CustomerResponse build() {
            return new CustomerResponse(id, name, phone, email, address, createdAt, updatedAt);
        }
    }

    // ─── Inner class for address response ────────────────────────────────────

    /** Inner class for address response */
    public static class AddressResponse {

        private String street;
        private String city;
        private String state;
        private String pincode;
        private String country;

        // Constructors

        public AddressResponse() {
        }

        public AddressResponse(String street, String city, String state, String pincode, String country) {
            this.street = street;
            this.city = city;
            this.state = state;
            this.pincode = pincode;
            this.country = country;
        }

        // Getters

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

        // Setters

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

        // Builder

        public static AddressResponseBuilder builder() {
            return new AddressResponseBuilder();
        }

        public static class AddressResponseBuilder {
            private String street;
            private String city;
            private String state;
            private String pincode;
            private String country;

            private AddressResponseBuilder() {
            }

            public AddressResponseBuilder street(String street) {
                this.street = street;
                return this;
            }

            public AddressResponseBuilder city(String city) {
                this.city = city;
                return this;
            }

            public AddressResponseBuilder state(String state) {
                this.state = state;
                return this;
            }

            public AddressResponseBuilder pincode(String pincode) {
                this.pincode = pincode;
                return this;
            }

            public AddressResponseBuilder country(String country) {
                this.country = country;
                return this;
            }

            public AddressResponse build() {
                return new AddressResponse(street, city, state, pincode, country);
            }
        }
    }
}
