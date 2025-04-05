package com.yucircle.profileapp;

import com.yucircle.profileapp.utils.EnvLoader;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class YuCircleProfileServiceApplication {

    public static void main(String[] args) {
		System.out.println("Working directory: " + new java.io.File(".").getAbsolutePath());
        if (!"true".equalsIgnoreCase(System.getenv("RENDER"))) {
            //  local dev → load .env manually
            EnvLoader.load(".env");
        }

        SpringApplication.run(YuCircleProfileServiceApplication.class, args);
    }
}