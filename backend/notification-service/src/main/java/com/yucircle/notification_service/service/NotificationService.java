package com.yucircle.notification_service.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Deque;
import java.util.LinkedList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.yucircle.notification_service.model.Notification;
import com.yucircle.notification_service.respositories.NotificationRepository;

@Service
public class NotificationService {
	
	@Autowired
	private NotificationRepository nRepo;

	public Deque<String> getAllUserNotifications(String username) {
		
		/*
		createNotification(username);
		
		List<Notification> listN= nRepo.findByUsername(username);
		Deque<String> notifications = new LinkedList<>();
		
		for (Notification n : listN) {
			notifications.addFirst(n.getUsername() + " " + n.getMessage() + " " + n.getTimestamp());
		}
		
		return notifications;
		*/
		
		return null;
	}
	
	/*
	private void createNotification(String username) {
		Notification n = new Notification();
		n.setMessage("I'm a Test Message");
		n.setTimestamp(LocalDateTime.now());
		n.setUsername(username);
		
		nRepo.save(n);
	}
	*/

}
