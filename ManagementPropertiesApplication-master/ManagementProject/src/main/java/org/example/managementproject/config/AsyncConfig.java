package org.example.managementproject.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;

@Configuration
@EnableAsync
public class AsyncConfig {
    // @Async annotation on EmailService methods will now work
    // Emails send in background thread — won't slow down API responses
}