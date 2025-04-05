package com.yucircle.notification_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import com.yucircle.notification_service.utils.EnvLoader;

@SpringBootApplication
public class NotificationServiceApplication {

	public static void main(String[] args) {
		EnvLoader.load(".env");
		SpringApplication.run(NotificationServiceApplication.class, args);
	}

}
