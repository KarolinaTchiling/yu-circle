package com.yucircle.messagingapp.model;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "messages")
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String sender;
    private String receiver;
    private String content;
    private LocalDateTime timestamp;
    
    
	// Getters
    public String getSender() {
		return this.sender;
	}
    
	public String getReceiver() {
		return this.receiver;
	}
	
	public String getContent() {
		return this.content;
	}
	
	public LocalDateTime getTimestamp() {
		return this.timestamp;
	}

	
	// Setters
	public void setSender(String sender) {
		this.sender = sender;
	}
	
	public void setReceiver(String receiver) {
		this.receiver = receiver;
	}
	
	public void setContent(String content) {
		this.content = content;
	}
	
	public void setTimestamp(LocalDateTime timestamp) {
		this.timestamp = timestamp;
	}
}