package com.yucircle.messagingapp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import com.yucircle.messagingapp.utils.EnvLoader;

@SpringBootApplication
public class YuCircleMessagingServiceApplication {

	public static void main(String[] args) {
		EnvLoader.load(".env");
		SpringApplication.run(YuCircleMessagingServiceApplication.class, args);
	}

}
