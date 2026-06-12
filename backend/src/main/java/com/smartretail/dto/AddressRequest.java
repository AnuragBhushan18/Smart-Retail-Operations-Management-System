package com.smartretail.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * AddressRequest DTO - Used inside CustomerRequest.
 * Represents the address sub-object in a customer create/update request.
 */
public class AddressRequest {

    @NotBlank(message = "Street address is required")
    private String street;

    @NotBlank(message = "City is required")
    private String city;

    @NotBlank(message = "State is required")
    private String state;

    @NotBlank(message = "Pincode is required")
    @Size(min = 4, max = 10, message = "Pincode must be between 4 and 10 characters")
    private String pincode;

    @NotBlank(message = "Country is required")
    private String country;

    // ─── Constructors ────────────────────────────────────────────────────────

    public AddressRequest() {
    }

    public AddressRequest(String street, String city, String state, String pincode, String country) {
        this.street = street;
        this.city = city;
        this.state = state;
        this.pincode = pincode;
        this.country = country;
    }

    // ─── Getters ─────────────────────────────────────────────────────────────

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
        private String street;
        private String city;
        private String state;
        private String pincode;
        private String country;

        private Builder() {
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

        public AddressRequest build() {
            return new AddressRequest(street, city, state, pincode, country);
        }
    }
}
