package com.intrabank.intrabank_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class IntrabankBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(IntrabankBackendApplication.class, args);
    }
} 