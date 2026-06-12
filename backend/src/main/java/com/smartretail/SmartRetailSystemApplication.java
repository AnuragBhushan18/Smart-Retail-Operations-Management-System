package com.smartretail;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * ============================================================
 * SmartRetailSystemApplication - Main Entry Point
 * ============================================================
 *
 * @SpringBootApplication is a convenience annotation that combines:
 *   1. @Configuration     - Marks this as a Spring configuration class
 *   2. @EnableAutoConfiguration - Enables Spring Boot's auto-configuration
 *   3. @ComponentScan     - Scans for Spring components in this package
 *
 * When you run this class, Spring Boot:
 *   1. Starts an embedded Tomcat server (default port: 8080)
 *   2. Auto-configures MongoDB connection
 *   3. Registers all controllers, services, repositories
 *   4. Sets up Swagger UI
 * ============================================================
 */
@SpringBootApplication
public class SmartRetailSystemApplication {

    public static void main(String[] args) {
        SpringApplication.run(SmartRetailSystemApplication.class, args);
        System.out.println("=================================================");
        System.out.println("  Smart Retail System Started Successfully!");
        System.out.println("  API:     http://localhost:8080/api");
        System.out.println("  Swagger: http://localhost:8080/swagger-ui.html");
        System.out.println("=================================================");
    }
}
