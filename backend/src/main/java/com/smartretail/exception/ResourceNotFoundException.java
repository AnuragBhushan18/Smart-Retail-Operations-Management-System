package com.smartretail.exception;

import org.springframework.http.HttpStatus;

/**
 * ============================================================
 * ResourceNotFoundException - Custom Exception Class
 * ============================================================
 *
 * This exception is thrown when a requested resource (product,
 * customer, order, etc.) is not found in the database.
 *
 * Why create a custom exception?
 *   - More meaningful error messages than generic exceptions
 *   - Mapped to HTTP 404 Not Found status
 *   - Caught by GlobalExceptionHandler to return clean JSON errors
 *
 * Example Usage:
 *   Product product = productRepository.findById(id)
 *       .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));
 *   // Returns: {"error": "Product not found with id: 12345"}
 * ============================================================
 */
public class ResourceNotFoundException extends RuntimeException {

    private final String resourceName;
    private final String fieldName;
    private final Object fieldValue;

    /**
     * Constructor
     * @param resourceName - Type of resource (e.g., "Product", "Customer")
     * @param fieldName    - Field used to look up (e.g., "id", "email")
     * @param fieldValue   - The value that wasn't found
     */
    public ResourceNotFoundException(String resourceName, String fieldName, Object fieldValue) {
        // Creates message: "Product not found with id: 12345"
        super(String.format("%s not found with %s: '%s'", resourceName, fieldName, fieldValue));
        this.resourceName = resourceName;
        this.fieldName = fieldName;
        this.fieldValue = fieldValue;
    }

    public String getResourceName() { return resourceName; }
    public String getFieldName() { return fieldName; }
    public Object getFieldValue() { return fieldValue; }
}
