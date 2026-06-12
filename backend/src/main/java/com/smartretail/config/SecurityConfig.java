package com.smartretail.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

/**
 * ============================================================
 * SecurityConfig - Spring Security Configuration (Phase 1 Setup)
 * ============================================================
 *
 * PURPOSE in Phase 1:
 *   - PERMIT ALL requests (disable authentication for now)
 *   - Configure CORS to allow React frontend (port 3000) to call our API (port 8080)
 *   - Disable CSRF (not needed for stateless REST APIs)
 *   - Set up BCrypt password encoder
 *
 * WHY CORS?
 *   CORS (Cross-Origin Resource Sharing) is a browser security feature.
 *   When React (localhost:3000) calls our API (localhost:8080),
 *   the browser blocks this by default. We must explicitly allow it.
 *
 * IN PHASE 9:
 *   We will add JWT filter to this chain to protect private endpoints.
 * ============================================================
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    /**
     * Security Filter Chain
     * Defines what URLs are public and what require authentication.
     * In Phase 1-8, ALL routes are public for easy development/testing.
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // Disable CSRF - not needed for REST APIs (stateless, no sessions)
                .csrf(AbstractHttpConfigurer::disable)

                // Configure CORS with our custom source defined below
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // Session management - STATELESS means no server-side sessions
                // Each request must carry the JWT token for authentication
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // Authorization rules
                .authorizeHttpRequests(auth -> auth
                        // Allow Swagger UI and API docs without authentication
                        .requestMatchers(
                                "/swagger-ui.html",
                                "/swagger-ui/**",
                                "/api-docs/**",
                                "/v3/api-docs/**"
                        ).permitAll()
                        // Allow auth endpoints without authentication
                        .requestMatchers("/auth/**").permitAll()
                        // In Phase 1-8: Allow ALL other requests without authentication
                        // In Phase 9: Change this to .authenticated()
                        .anyRequest().permitAll()
                );

        return http.build();
    }

    /**
     * CORS Configuration
     * Allows the React frontend to make API calls to this backend.
     *
     * allowedOrigins: URLs allowed to call our API
     * allowedMethods: HTTP methods allowed (GET, POST, PUT, DELETE, etc.)
     * allowedHeaders: HTTP headers allowed in requests
     * allowCredentials: Allow cookies and auth headers
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // Allow React dev server (port 3000) and any localhost port
        configuration.setAllowedOriginPatterns(List.of(
                "http://localhost:3000",
                "http://localhost:5173",  // Vite dev server
                "http://localhost:*"
        ));

        // Allow all standard HTTP methods
        configuration.setAllowedMethods(Arrays.asList(
                "GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"
        ));

        // Allow all headers including Authorization (for JWT)
        configuration.setAllowedHeaders(List.of("*"));

        // Allow credentials (cookies, auth headers)
        configuration.setAllowCredentials(true);

        // Cache preflight response for 1 hour (performance optimization)
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration); // Apply to all routes
        return source;
    }

    /**
     * Password Encoder
     * BCrypt is a strong, adaptive hashing algorithm for passwords.
     *
     * Why BCrypt?
     * - Automatically salts passwords (prevents rainbow table attacks)
     * - Industry standard for password hashing
     * - Spring Security recommends it
     *
     * Usage: passwordEncoder.encode("rawPassword") → hashed string
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
