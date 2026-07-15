package com.example.rams.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    OpenAPI resourceAllocationOpenApi() {
        return new OpenAPI()
                .info(new Info()
                        .title("Resource Allocation Management System API")
                        .description("REST API for employees, projects, allocations, reports and AI assistant features.")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("RAMS Team")
                                .email("support@company.com"))
                        .license(new License()
                                .name("Academic Project")));
    }
}
