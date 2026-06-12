package com.smartretail.dto;

import jakarta.validation.constraints.NotBlank;

/**
 * ============================================================
 * LoginRequest DTO - Incoming Credentials for Authentication
 * ============================================================
 */
public class LoginRequest {

    @NotBlank(message = "Username or email is required")
    private String username;

    @NotBlank(message = "Password is required")
    private String password;

    // ─── Constructors ────────────────────────────────────────────────────────

    public LoginRequest() {
    }

    public LoginRequest(String username, String password) {
        this.username = username;
        this.password = password;
    }

    // ─── Getters ─────────────────────────────────────────────────────────────

    public String getUsername() {
        return username;
    }

    public String getPassword() {
        return password;
    }

    // ─── Setters ─────────────────────────────────────────────────────────────

    public void setUsername(String username) {
        this.username = username;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    // ─── Builder ──────────────────────────────────────────────────────────────

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String username;
        private String password;

        private Builder() {
        }

        public Builder username(String username) {
            this.username = username;
            return this;
        }

        public Builder password(String password) {
            this.password = password;
            return this;
        }

        public LoginRequest build() {
            return new LoginRequest(username, password);
        }
    }
}
