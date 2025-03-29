package com.yucircle.notification_service.controller;

import java.util.Deque;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.yucircle.notification_service.model.Notification;
import com.yucircle.notification_service.service.NotificationService;

@RestController
@RequestMapping("notification")
public class NotificationController {

	@Autowired
	private NotificationService nService;
	
	@GetMapping("/get-notifications/{username}")
	public Deque<Notification> getAllUserNotifications(@PathVariable String username) {
		
		return nService.getAllUserNotifications(username);
	}
	
	@DeleteMapping("/{id}")
	public ResponseEntity<HttpStatus> removeNotification(@PathVariable Long id) {
		
		nService.removeNotification(id);

		return ResponseEntity.ok(HttpStatus.OK);
	}

	@PostMapping("/create")
	public ResponseEntity<Notification> createNotification(@RequestBody Notification notification) {
		Notification created = nService.createNotification(notification);
		return new ResponseEntity<>(created, HttpStatus.CREATED);
	}
	
}
