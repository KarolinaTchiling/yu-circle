package com.yucircle.discourceapp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import com.yucircle.discourceapp.utils.EnvLoader;

@SpringBootApplication
public class YuCircleDiscourseServiceApplication {

	public static void main(String[] args) {

		if (!"true".equalsIgnoreCase(System.getenv("RENDER"))) {
            //  local dev → load .env manually
            EnvLoader.load(".env");
        }
		SpringApplication.run(YuCircleDiscourseServiceApplication.class, args);
	}

}
