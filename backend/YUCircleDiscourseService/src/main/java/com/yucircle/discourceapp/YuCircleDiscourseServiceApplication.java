package com.yucircle.discourceapp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import com.yucircle.discourceapp.utils.EnvLoader;

@SpringBootApplication
public class YuCircleDiscourseServiceApplication {

	public static void main(String[] args) {
		EnvLoader.load(".env");
		SpringApplication.run(YuCircleDiscourseServiceApplication.class, args);
	}

}
