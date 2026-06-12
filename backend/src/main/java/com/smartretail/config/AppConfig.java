package com.smartretail.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

/**
 * ============================================================
 * AppConfig - Application-Level Configuration Properties
 * ============================================================
 *
 * @Configuration - Marks this as a Spring configuration class
 * @Value - Injects values from application.properties
 *
 * This class acts as a central place to access custom
 * application properties defined in application.properties.
 *
 * Why use @Value instead of reading properties directly?
 *   - Type-safe access to configuration
 *   - Easy to change values without touching business logic
 *   - Spring manages the injection automatically
 * ============================================================
 */
@Configuration
public class AppConfig {

    /**
     * Low Stock Threshold
     * Value from: app.inventory.low-stock-threshold=10 (application.properties)
     *
     * When a product's stock falls below this number,
     * the system will flag it as "Low Stock" in the dashboard.
     *
     * Business Logic Example:
     *   if (product.getStockQuantity() < lowStockThreshold) {
     *       // mark as low stock, send alert
     *   }
     */
    @Value("${app.inventory.low-stock-threshold:10}")
    private int lowStockThreshold;

    /**
     * JWT Secret Key
     * Value from: app.jwt.secret (application.properties)
     * Used to sign and verify JWT tokens.
     */
    @Value("${app.jwt.secret}")
    private String jwtSecret;

    /**
     * JWT Token Expiration
     * Value from: app.jwt.expiration (application.properties)
     * In milliseconds (86400000 = 24 hours)
     */
    @Value("${app.jwt.expiration:86400000}")
    private long jwtExpiration;

    // ---- Getters ----

    public int getLowStockThreshold() {
        return lowStockThreshold;
    }

    public String getJwtSecret() {
        return jwtSecret;
    }

    public long getJwtExpiration() {
        return jwtExpiration;
    }
}
