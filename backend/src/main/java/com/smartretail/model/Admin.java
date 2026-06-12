package com.smartretail.model;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

/**
 * ============================================================
 * Admin Model - MongoDB Document
 * ============================================================
 *
 * Represents a system administrator who can log in and manage
 * all modules (Products, Orders, Customers, etc.)
 *
 * MongoDB Collection: "admins"
 *
 * SECURITY NOTES:
 *   - Password is NEVER stored as plain text
 *   - BCryptPasswordEncoder hashes the password before saving
 *   - The stored value looks like: "$2a$10$N9qo8u..."
 *   - Even if database is stolen, passwords cannot be reversed
 * ============================================================
 */
@Document(collection = "admins")
public class Admin {

    @Id
    private String id;

    /** Display name of the admin */
    private String name;

    /**
     * Username used for login.
     * @Indexed(unique = true) ensures no two admins share a username.
     */
    @Indexed(unique = true)
    private String username;

    /**
     * Email address - used as alternate login identifier.
     * @Indexed(unique = true) ensures uniqueness.
     */
    @Indexed(unique = true)
    private String email;

    /**
     * BCrypt-hashed password.
     * NEVER store plain text passwords!
     * Use: passwordEncoder.encode("rawPassword") before saving.
     */
    private String password;

    /**
     * Admin role for future role-based access control.
     * Currently: "ADMIN"
     * Future: "SUPER_ADMIN", "MANAGER", etc.
     */
    private String role;

    /** Whether this admin account is active */
    private boolean active;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    // ─── Constructors ────────────────────────────────────────────────────────

    public Admin() {
    }

    public Admin(String id, String name, String username, String email, String password,
                 String role, boolean active, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.name = name;
        this.username = username;
        this.email = email;
        this.password = password;
        this.role = role;
        this.active = active;
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

    public String getUsername() {
        return username;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    public String getRole() {
        return role;
    }

    public boolean isActive() {
        return active;
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

    public void setUsername(String username) {
        this.username = username;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public void setActive(boolean active) {
        this.active = active;
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
        private String username;
        private String email;
        private String password;
        private String role;
        private boolean active;
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

        public Builder username(String username) {
            this.username = username;
            return this;
        }

        public Builder email(String email) {
            this.email = email;
            return this;
        }

        public Builder password(String password) {
            this.password = password;
            return this;
        }

        public Builder role(String role) {
            this.role = role;
            return this;
        }

        public Builder active(boolean active) {
            this.active = active;
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

        public Admin build() {
            return new Admin(id, name, username, email, password, role, active, createdAt, updatedAt);
        }
    }
}
