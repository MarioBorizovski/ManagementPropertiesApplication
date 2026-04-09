package org.example.managementproject;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class ManagementProjectApplication {

    public static void main(String[] args) {
        SpringApplication.run(ManagementProjectApplication.class, args);
    }

}
