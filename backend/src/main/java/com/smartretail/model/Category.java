package com.smartretail.model;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.LocalDateTime;

/**
 * ============================================================
 * Category Model - MongoDB Document
 * ============================================================
 *
 * @Document(collection = "categories"):
 *   Maps this Java class to the "categories" collection in MongoDB.
 *   Every field in this class becomes a field in the MongoDB document.
 *
 * WHY Category first?
 *   Products reference Categories (One-to-Many relationship).
 *   Category must be defined before Product.
 *
 * RELATIONSHIP: One Category → Many Products
 * ============================================================
 */
@Document(collection = "categories")
public class Category {

    /**
     * @Id - Maps to MongoDB's "_id" field (ObjectId).
     * MongoDB auto-generates this as a 24-character hex string.
     * Example: "64f1a2b3c4d5e6f7a8b9c0d1"
     */
    @Id
    private String id;

    /**
     * @Indexed(unique = true) - Creates a unique index in MongoDB.
     * Prevents duplicate category names.
     * MongoDB will reject inserting "Electronics" if it already exists.
     */
    @Indexed(unique = true)
    private String name;

    private String description;

    /**
     * @CreatedDate - Automatically set when the document is first saved.
     * Requires @EnableMongoAuditing in MongoConfig.java
     */
    @CreatedDate
    private LocalDateTime createdAt;

    /**
     * @LastModifiedDate - Automatically updated on every save.
     */
    @LastModifiedDate
    private LocalDateTime updatedAt;

    // ─── Constructors ────────────────────────────────────────────────────────

    public Category() {
    }

    public Category(String id, String name, String description, LocalDateTime createdAt, LocalDateTime updatedAt) {
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

        public Category build() {
            return new Category(id, name, description, createdAt, updatedAt);
        }
    }
}
