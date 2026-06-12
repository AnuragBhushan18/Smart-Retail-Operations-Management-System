package com.smartretail.service;

import com.smartretail.dto.CategoryRequest;
import com.smartretail.dto.CategoryResponse;

import java.util.List;

/**
 * ============================================================
 * CategoryService Interface
 * ============================================================
 *
 * WHY define an interface?
 * ─────────────────────────
 * 1. ABSTRACTION: Controllers depend on this interface, not the
 *    implementation. This is called "programming to an interface."
 *
 * 2. TESTABILITY: In tests, we can swap the real implementation
 *    with a mock (fake) implementation without changing controllers.
 *
 * 3. MULTIPLE IMPLEMENTATIONS: You could have CategoryServiceImpl
 *    for production and MockCategoryService for testing.
 *
 * The controller only knows about CategoryService (the interface).
 * It doesn't care HOW the data is fetched — just that it IS fetched.
 * ============================================================
 */
public interface CategoryService {
    CategoryResponse createCategory(CategoryRequest request);
    CategoryResponse getCategoryById(String id);
    List<CategoryResponse> getAllCategories();
    CategoryResponse updateCategory(String id, CategoryRequest request);
    void deleteCategory(String id);
}
