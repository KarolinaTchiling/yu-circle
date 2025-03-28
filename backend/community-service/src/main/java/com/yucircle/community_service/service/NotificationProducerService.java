package com.yucircle.community_service.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.yucircle.community_service.model.Notification;
import com.yucircle.community_service.repositories.NotificationRepository;

@Service
public class NotificationProducerService {
	
	@Autowired
	private NotificationRepository nRepo;

	public void createConnectionRequestNotification(String sender, String receiver) {
		Notification n = new Notification();
		n.setUsername(receiver);
		n.setMessage(sender + " sent you a message request!");
		
		nRepo.save(n);
	}

}
