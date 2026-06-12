package com.smartretail.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * ============================================================
 * GlobalExceptionHandler - Centralized Error Handling
 * ============================================================
 *
 * @RestControllerAdvice intercepts exceptions from ALL controllers
 * and converts them to clean JSON error responses.
 *
 * Every error returns a consistent JSON structure like:
 * {
 *   "timestamp": "2024-01-01T12:00:00",
 *   "status": 404,
 *   "error": "Not Found",
 *   "message": "Product not found with id: '12345'",
 *   "path": "/api/products/12345"
 * }
 * ============================================================
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    // -------------------------------------------------------
    // Handle Resource Not Found (404)
    // -------------------------------------------------------
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleResourceNotFoundException(
            ResourceNotFoundException ex, WebRequest request) {

        ErrorResponse error = new ErrorResponse(
                LocalDateTime.now(),
                HttpStatus.NOT_FOUND.value(),
                "Not Found",
                ex.getMessage(),
                extractPath(request)
        );
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    // -------------------------------------------------------
    // Handle Duplicate Resource (409 Conflict)
    // -------------------------------------------------------
    @ExceptionHandler(DuplicateResourceException.class)
    public ResponseEntity<ErrorResponse> handleDuplicateResourceException(
            DuplicateResourceException ex, WebRequest request) {

        ErrorResponse error = new ErrorResponse(
                LocalDateTime.now(),
                HttpStatus.CONFLICT.value(),
                "Conflict",
                ex.getMessage(),
                extractPath(request)
        );
        return ResponseEntity.status(HttpStatus.CONFLICT).body(error);
    }

    // -------------------------------------------------------
    // Handle Validation Errors (400 Bad Request)
    // Triggered when @Valid fails on a request body
    // -------------------------------------------------------
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ValidationErrorResponse> handleValidationErrors(
            MethodArgumentNotValidException ex, WebRequest request) {

        Map<String, String> fieldErrors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach(err -> {
            String fieldName = ((FieldError) err).getField();
            String message = err.getDefaultMessage();
            fieldErrors.put(fieldName, message);
        });

        ValidationErrorResponse error = new ValidationErrorResponse(
                LocalDateTime.now(),
                HttpStatus.BAD_REQUEST.value(),
                "Validation Failed",
                "Input validation failed. Please check the field errors.",
                extractPath(request),
                fieldErrors
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    // -------------------------------------------------------
    // Handle Illegal Argument (400 Bad Request)
    // -------------------------------------------------------
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleIllegalArgumentException(
            IllegalArgumentException ex, WebRequest request) {

        ErrorResponse error = new ErrorResponse(
                LocalDateTime.now(),
                HttpStatus.BAD_REQUEST.value(),
                "Bad Request",
                ex.getMessage(),
                extractPath(request)
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    // -------------------------------------------------------
    // Catch-All: Handle Any Other Exception (500)
    // -------------------------------------------------------
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGlobalException(
            Exception ex, WebRequest request) {

        ErrorResponse error = new ErrorResponse(
                LocalDateTime.now(),
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                "Internal Server Error",
                "An unexpected error occurred. Please try again later.",
                extractPath(request)
        );
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }

    // -------------------------------------------------------
    // Helper: extract clean path from WebRequest
    // -------------------------------------------------------
    private String extractPath(WebRequest request) {
        return request.getDescription(false).replace("uri=", "");
    }

    // ============================================================
    // RESPONSE DTOs (Static inner classes)
    // Using public fields so Jackson can serialize them to JSON.
    // ============================================================

    /**
     * Standard error response returned for most errors.
     */
    public static class ErrorResponse {
        public final LocalDateTime timestamp;
        public final int status;
        public final String error;
        public final String message;
        public final String path;

        public ErrorResponse(LocalDateTime timestamp, int status,
                             String error, String message, String path) {
            this.timestamp = timestamp;
            this.status    = status;
            this.error     = error;
            this.message   = message;
            this.path      = path;
        }
    }

    /**
     * Extended error response for validation failures.
     * Adds a map of field-specific error messages.
     */
    public static class ValidationErrorResponse extends ErrorResponse {
        public final Map<String, String> fieldErrors;

        public ValidationErrorResponse(LocalDateTime timestamp, int status,
                                       String error, String message,
                                       String path, Map<String, String> fieldErrors) {
            super(timestamp, status, error, message, path);
            this.fieldErrors = fieldErrors;
        }
    }
}
