package com.smartretail.dto;

/**
 * ============================================================
 * LoginResponse DTO - Token and User Details Returned after Login
 * ============================================================
 */
public class LoginResponse {

    private String token;
    private String type = "Bearer";
    private String username;
    private String email;
    private String name;
    private String role;

    // ─── Constructors ────────────────────────────────────────────────────────

    public LoginResponse() {
    }

    public LoginResponse(String token, String username, String email, String name, String role) {
        this.token = token;
        this.username = username;
        this.email = email;
        this.name = name;
        this.role = role;
    }

    // ─── Getters ─────────────────────────────────────────────────────────────

    public String getToken() {
        return token;
    }

    public String getType() {
        return type;
    }

    public String getUsername() {
        return username;
    }

    public String getEmail() {
        return email;
    }

    public String getName() {
        return name;
    }

    public String getRole() {
        return role;
    }

    // ─── Setters ─────────────────────────────────────────────────────────────

    public void setToken(String token) {
        this.token = token;
    }

    public void setType(String type) {
        this.type = type;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setRole(String role) {
        this.role = role;
    }

    // ─── Builder ──────────────────────────────────────────────────────────────

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String token;
        private String username;
        private String email;
        private String name;
        private String role;

        private Builder() {
        }

        public Builder token(String token) {
            this.token = token;
            return this;
        }

        public Builder username(String username) {
            this.username = username;
            return this;
        }

        public Builder email(String email) {
            this.email = email;
            return this;
        }

        public Builder name(String name) {
            this.name = name;
            return this;
        }

        public Builder role(String role) {
            this.role = role;
            return this;
        }

        public LoginResponse build() {
            return new LoginResponse(token, username, email, name, role);
        }
    }
}
