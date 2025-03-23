package com.yucircle.notification_service.controller;

import java.util.Deque;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.yucircle.notification_service.service.NotificationService;

@RestController
@RequestMapping("notification")
public class NotificationController {

	@Autowired
	private NotificationService nService;
	
	@GetMapping("/get-notifications/{username}")
	public Deque<String> getAllUserNotifications(@PathVariable String username) {
		
		return nService.getAllUserNotifications(username);
	}
}
