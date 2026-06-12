package com.smartretail.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;

/**
 * ============================================================
 * CustomerRequest DTO - Incoming data for Create/Update Customer
 * ============================================================
 *
 * Demonstrates nested DTO validation:
 * The 'address' field is itself a validated DTO.
 * @Valid on the nested object triggers validation on AddressRequest.
 *
 * Example request JSON:
 * {
 *   "name": "Rahul Sharma",
 *   "phone": "9876543210",
 *   "email": "rahul@example.com",
 *   "address": {
 *     "street": "42 MG Road",
 *     "city": "Bangalore",
 *     "state": "Karnataka",
 *     "pincode": "560001",
 *     "country": "India"
 *   }
 * }
 * ============================================================
 */
public class CustomerRequest {

    @NotBlank(message = "Customer name is required")
    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    private String name;

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^[+]?[0-9]{10,15}$", message = "Invalid phone number format")
    private String phone;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    /**
     * @Valid: Triggers validation on the nested AddressRequest object.
     * Without @Valid, the address fields would NOT be validated.
     */
    @Valid
    private AddressRequest address;

    // ─── Constructors ────────────────────────────────────────────────────────

    public CustomerRequest() {
    }

    public CustomerRequest(String name, String phone, String email, AddressRequest address) {
        this.name = name;
        this.phone = phone;
        this.email = email;
        this.address = address;
    }

    // ─── Getters ─────────────────────────────────────────────────────────────

    public String getName() {
        return name;
    }

    public String getPhone() {
        return phone;
    }

    public String getEmail() {
        return email;
    }

    public AddressRequest getAddress() {
        return address;
    }

    // ─── Setters ─────────────────────────────────────────────────────────────

    public void setName(String name) {
        this.name = name;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setAddress(AddressRequest address) {
        this.address = address;
    }

    // ─── Builder ──────────────────────────────────────────────────────────────

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String name;
        private String phone;
        private String email;
        private AddressRequest address;

        private Builder() {
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

        public Builder address(AddressRequest address) {
            this.address = address;
            return this;
        }

        public CustomerRequest build() {
            return new CustomerRequest(name, phone, email, address);
        }
    }
}
