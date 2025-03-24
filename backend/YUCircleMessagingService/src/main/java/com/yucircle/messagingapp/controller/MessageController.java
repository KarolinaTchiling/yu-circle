package com.yucircle.messagingapp.controller;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import com.yucircle.messagingapp.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.yucircle.messagingapp.model.Message;
import com.yucircle.messagingapp.service.MessageService;

@RestController
@RequestMapping("/messages")
public class MessageController {
    @Autowired
    private MessageService messageService;
    @Autowired
    private MessageRepository messageRepository;

    @GetMapping("/get")
    public List<Message> getConversation(@RequestParam String user1, @RequestParam String user2) {
        return messageService.getConversation(user1, user2);
    }
    
    @PostMapping("/send")
    public ResponseEntity<String> sendMessage(@RequestBody Map<String, String> request) {
    	Message message = new Message();
    	message.setSender(request.get("sender"));
    	message.setReceiver(request.get("receiver"));
    	message.setContent(request.get("content"));
        message.setTimestamp(LocalDateTime.now());
        messageRepository.save(message);
        return ResponseEntity.ok("Message sent.");
    }
    
    @GetMapping("/sent")
    public List<Message> getSentMessages(@RequestParam String sender) {
        return messageService.getMessagesBySender(sender);
    }
    
    @GetMapping("/received")
    public List<Message> getReceivedMessages(@RequestParam String receiver) {
        return messageService.getMessagesByReceiver(receiver);
    }
    
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteMessage(@PathVariable Long id) {
        if (messageRepository.existsById(id)) {
            messageService.deleteMessage(id);
            return ResponseEntity.ok("Message deleted.");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Message not found.");
        }
    }
}