package com.smartretail.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * ============================================================
 * HealthController - Application Health Check Endpoint
 * ============================================================
 *
 * This is a simple controller to verify the application is running.
 *
 * @RestController: Combination of @Controller + @ResponseBody
 *   - @Controller: Marks class as a Spring MVC controller
 *   - @ResponseBody: Methods return JSON, not HTML views
 *
 * @RequestMapping("/health"): All methods in this class
 *   will be prefixed with /health
 *   Full URL: http://localhost:8080/api/health
 *
 * WHY create a health check?
 *   - Quick way to verify the server is running
 *   - Verify MongoDB connection is working
 *   - Industry standard practice
 * ============================================================
 */
@RestController
@RequestMapping("/health")
public class HealthController {

    /**
     * GET /api/health
     * Returns server status and timestamp.
     *
     * Test in browser: http://localhost:8080/api/health
     * Expected response:
     * {
     *   "status": "UP",
     *   "message": "Smart Retail System is running",
     *   "timestamp": "2024-01-01T12:00:00"
     * }
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> healthCheck() {
        return ResponseEntity.ok(Map.of(
                "status", "UP",
                "application", "Smart Retail Operations & Inventory Management System",
                "version", "1.0.0",
                "timestamp", LocalDateTime.now().toString(),
                "message", "Server is running successfully!",
                "swagger", "http://localhost:8080/swagger-ui.html"
        ));
    }
}
