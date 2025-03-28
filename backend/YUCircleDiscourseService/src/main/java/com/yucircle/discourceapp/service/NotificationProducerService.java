package com.yucircle.discourceapp.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.yucircle.discourceapp.model.Comment;
import com.yucircle.discourceapp.model.Notification;
import com.yucircle.discourceapp.repository.NotificationRepository;

@Service
public class NotificationProducerService {

	@Autowired
	private NotificationRepository nRepo;
	
	public void createCommentNotification(Comment comment) {
				
		Notification n;
		
		// check if its a comment or reply
		if (comment.getParentComment() != null) {
			
			// if user is replying to their own comment, exit
			if (comment.getParentComment().getUsername().equals(comment.getUsername())) {
				return;
			}
			
			n = buildReplyNotification(comment);
		}
		else {
			
			// if user is commenting on their own post, exit
			if (comment.getPost().getUsername().equals(comment.getUsername())) {
				return;
			}
			
			n = buildCommentNotification(comment);
		}
		
		nRepo.save(n);
	}
	
	private Notification buildCommentNotification(Comment comment) {
		
		Notification n = new Notification();
		
		String message = comment.getUsername() + " has commented on your post; ";
		message += "\"" + comment.getPost().getTitle() + "\"";
		
		n.setUsername(comment.getPost().getUsername());
		n.setMessage(message);
		
		return n;
	}
	
	private Notification buildReplyNotification(Comment comment) {
		Notification n = new Notification();
		
		String message = comment.getUsername() + " has replied to your comment; "; 
		message += "\"" + comment.getParentComment().getContent() + "\"";
		
		n.setUsername(comment.getParentComment().getUsername());
		n.setMessage(message);
		
		return n;
	}
}
