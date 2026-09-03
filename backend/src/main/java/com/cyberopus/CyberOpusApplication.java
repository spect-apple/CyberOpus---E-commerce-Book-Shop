package com.cyberopus;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class CyberOpusApplication {
    public static void main(String[] args) {
        SpringApplication.run(CyberOpusApplication.class, args);
    }
}
