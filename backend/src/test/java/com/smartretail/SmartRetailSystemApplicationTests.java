package com.smartretail;

import com.smartretail.SmartRetailSystemApplication;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

/**
 * ============================================================
 * SmartRetailSystemApplicationTests - Spring Boot Context Test
 * ============================================================
 *
 * @SpringBootTest: Loads the complete Spring Application Context.
 *   This verifies that:
 *   1. Spring can start up without errors
 *   2. All beans are properly configured
 *   3. MongoDB connection is available
 *   4. No configuration conflicts exist
 *
 * HOW TO RUN:
 *   mvn test
 *   OR right-click in IntelliJ → Run Test
 *
 * NOTE: This test requires MongoDB to be running!
 * ============================================================
 */
@SpringBootTest
class SmartRetailSystemApplicationTests {

    /**
     * Context Loads Test
     * The most fundamental test - verifies the application starts.
     * If this fails, check: MongoDB connection, bean configuration.
     */
    @Test
    void contextLoads() {
        // If Spring context loads without exceptions, this test passes
        System.out.println("✅ Spring Boot Application Context loaded successfully!");
    }
}
