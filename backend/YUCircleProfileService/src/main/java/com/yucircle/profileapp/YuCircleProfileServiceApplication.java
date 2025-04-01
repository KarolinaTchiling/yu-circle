package com.yucircle.profileapp;

import com.yucircle.profileapp.utils.EnvLoader;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class YuCircleProfileServiceApplication {

	public static void main(String[] args) {
		// Load environment variables from .env
		EnvLoader.load(".env");

		// Start the Spring Boot app
		SpringApplication.run(YuCircleProfileServiceApplication.class, args);
	}
}