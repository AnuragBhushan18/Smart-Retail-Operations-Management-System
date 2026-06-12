package com.smartretail.repository;

import com.smartretail.model.Category;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * ============================================================
 * CategoryRepository - Database Access Layer for Categories
 * ============================================================
 *
 * @Repository marks this as a Spring Data repository.
 *
 * MongoRepository<Category, String>:
 *   - Category = The document class this repository manages
 *   - String   = The type of the @Id field (MongoDB ObjectId as String)
 *
 * By extending MongoRepository, Spring auto-generates implementations
 * for ALL standard CRUD operations:
 *
 *   save(category)           → INSERT or UPDATE
 *   findById(id)             → SELECT by _id
 *   findAll()                → SELECT all documents
 *   deleteById(id)           → DELETE by _id
 *   count()                  → COUNT all documents
 *   existsById(id)           → Check if document exists
 *
 * CUSTOM QUERY METHODS (Spring Data derives SQL from method names):
 *   findByName("Electronics") → db.categories.find({name: "Electronics"})
 *   existsByName("Electronics") → Check if name exists
 *
 * Spring Data MongoDB reads the method name and builds the query automatically!
 * No need to write @Query annotations for simple lookups.
 * ============================================================
 */
@Repository
public interface CategoryRepository extends MongoRepository<Category, String> {

    /**
     * Find a category by its name (case-sensitive).
     * Used to check for duplicates before creating a new category.
     *
     * Spring translates this to:
     *   db.categories.findOne({ name: "Electronics" })
     */
    Optional<Category> findByName(String name);

    /**
     * Check if a category with the given name already exists.
     * Used for duplicate validation.
     *
     * Spring translates this to:
     *   db.categories.countDocuments({ name: "Electronics" }) > 0
     */
    boolean existsByName(String name);

    /**
     * Check if a category with the given name exists, excluding a specific ID.
     * Used during UPDATE to allow a category to keep its own name
     * but reject if another category has the same name.
     *
     * Spring translates this to:
     *   db.categories.findOne({ name: name, _id: { $ne: id } })
     */
    boolean existsByNameAndIdNot(String name, String id);
}
