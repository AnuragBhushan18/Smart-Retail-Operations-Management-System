package com.smartretail.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.config.EnableMongoAuditing;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.MongoDatabaseFactory;

/**
 * ============================================================
 * MongoConfig - MongoDB Configuration Class
 * ============================================================
 *
 * @Configuration marks this class as a Spring configuration class.
 *   It contains bean definitions that Spring will manage.
 *
 * @EnableMongoAuditing enables automatic auditing features like:
 *   - @CreatedDate: Automatically sets when a document is created
 *   - @LastModifiedDate: Automatically updates on modification
 *   - @CreatedBy / @LastModifiedBy: Tracks who made changes
 *
 * Spring Boot auto-configures the MongoDB connection from
 * application.properties, so we just need to enable auditing here.
 * ============================================================
 */
@Configuration
@EnableMongoAuditing
public class MongoConfig {

    /**
     * MongoTemplate Bean
     * -------------------------------------------------
     * MongoTemplate is a higher-level MongoDB operations class.
     * It gives us fine-grained control over MongoDB operations
     * beyond what repositories provide.
     *
     * Example uses:
     *   - mongoTemplate.save(object)       → Insert or update
     *   - mongoTemplate.find(query, Class) → Complex queries
     *   - mongoTemplate.updateFirst(...)   → Partial updates
     *   - mongoTemplate.aggregate(...)     → Aggregation pipelines
     *
     * @param factory - Spring Boot auto-creates this from application.properties
     * @return MongoTemplate instance
     */
    @Bean
    public MongoTemplate mongoTemplate(MongoDatabaseFactory factory) {
        return new MongoTemplate(factory);
    }
}
