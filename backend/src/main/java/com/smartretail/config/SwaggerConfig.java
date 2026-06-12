package com.smartretail.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.Components;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * ============================================================
 * SwaggerConfig - Swagger/OpenAPI Documentation Configuration
 * ============================================================
 *
 * Swagger UI allows you to:
 *   1. View all available API endpoints
 *   2. Test APIs directly from the browser (no Postman needed)
 *   3. See request/response structures
 *   4. Understand expected inputs and outputs
 *
 * After starting the application, access Swagger at:
 *   http://localhost:8080/swagger-ui.html
 *
 * Why Swagger?
 *   - Required by professor for API documentation
 *   - Industry-standard way to document REST APIs
 *   - Makes Postman testing easier (import from OpenAPI spec)
 * ============================================================
 */
@Configuration
public class SwaggerConfig {

    private static final String SECURITY_SCHEME_NAME = "Bearer Authentication";

    /**
     * Creates the OpenAPI documentation bean.
     * This populates the Swagger UI with project information
     * and configures JWT authentication in the UI.
     */
    @Bean
    public OpenAPI openAPI() {
        return new OpenAPI()
                // -----------------------------------------------
                // API METADATA - Shows in the Swagger UI header
                // -----------------------------------------------
                .info(new Info()
                        .title("Smart Retail Operations & Inventory Management API")
                        .description("""
                                ## Overview
                                RESTful API for the Smart Retail Operations and Inventory Management System.
                                
                                ## Features
                                - **Product Management** - Add, view, update, delete products
                                - **Category Management** - Organize products by categories
                                - **Supplier Management** - Manage product suppliers
                                - **Customer Management** - Manage customer data
                                - **Order Management** - Track orders from creation to delivery
                                - **Inventory Management** - Monitor stock levels and low stock alerts
                                - **Dashboard Analytics** - Summary statistics and reports
                                
                                ## Authentication
                                Use the **Authorize** button to enter your JWT token for protected endpoints.
                                Format: `Bearer <your-jwt-token>`
                                """)
                        .version("v1.0.0")
                        .contact(new Contact()
                                .name("Smart Retail System")
                                .email("admin@smartretail.com")
                                .url("http://localhost:8080"))
                        .license(new License()
                                .name("Academic Project License")
                                .url("http://localhost:8080")))

                // -----------------------------------------------
                // SECURITY SCHEME - JWT Bearer Token setup
                // Adds "Authorize" button in Swagger UI
                // -----------------------------------------------
                .addSecurityItem(new SecurityRequirement()
                        .addList(SECURITY_SCHEME_NAME))
                .components(new Components()
                        .addSecuritySchemes(SECURITY_SCHEME_NAME,
                                new SecurityScheme()
                                        .name(SECURITY_SCHEME_NAME)
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")
                                        .description("Enter JWT token to access protected endpoints")));
    }
}
