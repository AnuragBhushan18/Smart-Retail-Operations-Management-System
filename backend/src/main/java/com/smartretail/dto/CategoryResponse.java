package com.smartretail.dto;

import java.time.LocalDateTime;

/**
 * ============================================================
 * CategoryResponse DTO - Outgoing Data for API Responses
 * ============================================================
 *
 * This is what the API RETURNS to the client (Postman, React).
 *
 * Includes ALL fields including id, createdAt, updatedAt
 * because the client needs these for display and updates.
 *
 * No validation annotations needed here (it's outgoing data).
 *
 * Example JSON returned:
 * {
 *   "id": "64f1a2b3c4d5e6f7a8b9c0d1",
 *   "name": "Electronics",
 *   "description": "All electronic items",
 *   "createdAt": "2024-01-01T10:00:00",
 *   "updatedAt": "2024-01-01T10:00:00"
 * }
 * ============================================================
 */
public class CategoryResponse {

    private String id;
    private String name;
    private String description;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // ─── Constructors ────────────────────────────────────────────────────────

    public CategoryResponse() {
    }

    public CategoryResponse(String id, String name, String description,
                            LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.name = name;
        this.description = description;
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

    public String getDescription() {
        return description;
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

    public void setDescription(String description) {
        this.description = description;
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
        private String description;
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

        public Builder description(String description) {
            this.description = description;
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

        public CategoryResponse build() {
            return new CategoryResponse(id, name, description, createdAt, updatedAt);
        }
    }
}
