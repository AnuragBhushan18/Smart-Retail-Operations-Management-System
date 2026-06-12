package com.smartretail.dto;

import jakarta.validation.constraints.*;

/**
 * ============================================================
 * SupplierRequest DTO - Incoming Data for Create/Update Supplier
 * ============================================================
 */
public class SupplierRequest {

    @NotBlank(message = "Supplier name is required")
    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    private String name;

    /**
     * @Pattern: Validates against a regular expression.
     * This pattern accepts Indian phone numbers: 10 digits, optionally starting with +91
     */
    @NotBlank(message = "Contact number is required")
    @Pattern(regexp = "^[+]?[0-9]{10,15}$", message = "Invalid phone number format")
    private String contactNumber;

    /**
     * @Email: Validates email format (must contain @ and domain).
     * Example: "supplier@company.com" ✅ | "notanemail" ❌
     */
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @Size(max = 500, message = "Address cannot exceed 500 characters")
    private String address;

    // ─── Constructors ────────────────────────────────────────────────────────

    public SupplierRequest() {
    }

    public SupplierRequest(String name, String contactNumber, String email, String address) {
        this.name = name;
        this.contactNumber = contactNumber;
        this.email = email;
        this.address = address;
    }

    // ─── Getters ─────────────────────────────────────────────────────────────

    public String getName() {
        return name;
    }

    public String getContactNumber() {
        return contactNumber;
    }

    public String getEmail() {
        return email;
    }

    public String getAddress() {
        return address;
    }

    // ─── Setters ─────────────────────────────────────────────────────────────

    public void setName(String name) {
        this.name = name;
    }

    public void setContactNumber(String contactNumber) {
        this.contactNumber = contactNumber;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    // ─── Builder ──────────────────────────────────────────────────────────────

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String name;
        private String contactNumber;
        private String email;
        private String address;

        private Builder() {
        }

        public Builder name(String name) {
            this.name = name;
            return this;
        }

        public Builder contactNumber(String contactNumber) {
            this.contactNumber = contactNumber;
            return this;
        }

        public Builder email(String email) {
            this.email = email;
            return this;
        }

        public Builder address(String address) {
            this.address = address;
            return this;
        }

        public SupplierRequest build() {
            return new SupplierRequest(name, contactNumber, email, address);
        }
    }
}
