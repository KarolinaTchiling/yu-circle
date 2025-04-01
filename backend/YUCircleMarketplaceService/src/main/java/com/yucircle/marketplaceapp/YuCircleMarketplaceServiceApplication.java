package com.yucircle.marketplaceapp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import com.yucircle.marketplaceapp.utils.EnvLoader;

@SpringBootApplication
public class YuCircleMarketplaceServiceApplication {

	public static void main(String[] args) {
		EnvLoader.load(".env");
		SpringApplication.run(YuCircleMarketplaceServiceApplication.class, args);
	}

}
