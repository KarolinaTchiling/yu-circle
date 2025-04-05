package com.yucircle.messagingapp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import com.yucircle.messagingapp.utils.EnvLoader;

@SpringBootApplication
public class YuCircleMessagingServiceApplication {

	public static void main(String[] args) {

		if (!"true".equalsIgnoreCase(System.getenv("RENDER"))) {
            //  local dev → load .env manually
            EnvLoader.load(".env");
        }
		SpringApplication.run(YuCircleMessagingServiceApplication.class, args);
	}

}
