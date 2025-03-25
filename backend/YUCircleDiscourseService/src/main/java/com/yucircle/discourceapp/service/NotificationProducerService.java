package com.yucircle.discourceapp.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.yucircle.discourceapp.model.Notification;
import com.yucircle.discourceapp.repository.NotificationRepository;

@Service
public class NotificationProducerService {

	@Autowired
	private NotificationRepository nRepo;
	
	public void createNotification(String username) {
		Notification n = new Notification();
		n.setMessage("I'm a Test Message");
		n.setUsername(username);
		
		nRepo.save(n);
	}
}
