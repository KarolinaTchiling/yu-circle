package com.yucircle.messagingapp.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.yucircle.messagingapp.model.Message;
import com.yucircle.messagingapp.repository.MessageRepository;

@Service
public class MessageService {
    @Autowired
    private MessageRepository messageRepository;

    public List<Message> getConversation(String user1, String user2) {
        return messageRepository.findMessagesBetweenUsers(user1, user2);
    }
    
    public List<Message> getMessagesBySender(String sender) {
        return messageRepository.findBySender(sender);
    }
    
    public List<Message> getMessagesByReceiver(String receiver) {
        return messageRepository.findByReceiver(receiver);
    }
    
    public void deleteMessage(Long messageId) {
        messageRepository.deleteById(messageId);
    }
}