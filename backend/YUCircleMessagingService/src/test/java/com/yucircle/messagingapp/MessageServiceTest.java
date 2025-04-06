package com.yucircle.messagingapp;

import com.yucircle.messagingapp.*;
import com.yucircle.messagingapp.repository.MessageRepository;
import com.yucircle.messagingapp.service.*;

import com.yucircle.messagingapp.model.Message;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class MessageServiceTest {

    private MessageRepository messageRepository;
    private MessageService messageService;

    @BeforeEach
    void setUp() {
        messageRepository = mock(MessageRepository.class);
        messageService = new MessageService();

        // Use reflection to inject the mock since you can't modify the service class
        try {
            var field = MessageService.class.getDeclaredField("messageRepository");
            field.setAccessible(true);
            field.set(messageService, messageRepository);
        } catch (Exception e) {
            throw new RuntimeException("Failed to inject mock", e);
        }
    }

    private Message mockMessage(String sender, String receiver, String content) {
        Message msg = new Message();
        msg.setSender(sender);
        msg.setReceiver(receiver);
        msg.setContent(content);
        msg.setTimestamp(LocalDateTime.now());
        return msg;
    }

    @Test
    void testGetConversation() {
        Message msg1 = mockMessage("alice", "bob", "Hi");
        Message msg2 = mockMessage("bob", "alice", "Hello");

        when(messageRepository.findMessagesBetweenUsers("alice", "bob"))
                .thenReturn(List.of(msg1, msg2));

        List<Message> result = messageService.getConversation("alice", "bob");

        assertEquals(2, result.size());
        verify(messageRepository, times(1)).findMessagesBetweenUsers("alice", "bob");
    }

    @Test
    void testGetMessagesBySender() {
        Message msg = mockMessage("alice", "bob", "Sent message");
        when(messageRepository.findBySender("alice")).thenReturn(List.of(msg));

        List<Message> result = messageService.getMessagesBySender("alice");

        assertEquals(1, result.size());
        assertEquals("bob", result.get(0).getReceiver());
    }

    @Test
    void testGetMessagesByReceiver() {
        Message msg = mockMessage("carol", "bob", "Received message");
        when(messageRepository.findByReceiver("bob")).thenReturn(List.of(msg));

        List<Message> result = messageService.getMessagesByReceiver("bob");

        assertEquals(1, result.size());
        assertEquals("carol", result.get(0).getSender());
    }

    @Test
    void testDeleteMessage() {
        messageService.deleteMessage(100L);
        verify(messageRepository, times(1)).deleteById(100L);
    }
}
