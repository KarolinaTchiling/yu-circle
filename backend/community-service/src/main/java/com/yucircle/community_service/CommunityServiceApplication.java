package com.yucircle.community_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import com.yucircle.community_service.utils.EnvLoader;

@SpringBootApplication
public class CommunityServiceApplication {
	
	public static void main(String[] args) {

		if (!"true".equalsIgnoreCase(System.getenv("RENDER"))) {
            //  local dev → load .env manually
            EnvLoader.load(".env");
        }
		SpringApplication.run(CommunityServiceApplication.class, args);
	}
}
