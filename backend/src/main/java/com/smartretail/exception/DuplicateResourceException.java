package com.smartretail.exception;

/**
 * ============================================================
 * DuplicateResourceException - Custom Exception Class
 * ============================================================
 *
 * Thrown when someone tries to create a resource that already exists.
 * Example: Creating a product with a name that already exists,
 *          or registering a customer with an existing email.
 *
 * Mapped to HTTP 409 Conflict by GlobalExceptionHandler.
 * ============================================================
 */
public class DuplicateResourceException extends RuntimeException {

    /**
     * @param message - Clear description of the conflict
     *                  Example: "Product with name 'iPhone 15' already exists"
     */
    public DuplicateResourceException(String message) {
        super(message);
    }
}
