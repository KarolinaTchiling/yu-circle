package com.yucircle.messagingapp;

import com.yucircle.messagingapp.model.Message;

import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

class MessageTest {

    @Test
    void testSettersAndGetters() {
        Message message = new Message();

        Long id = 1L; // usually set by DB, but assume for logic completeness
        String sender = "alice";
        String receiver = "bob";
        String content = "Hello, Bob!";
        LocalDateTime timestamp = LocalDateTime.of(2025, 4, 6, 12, 30);

        // Simulate setting fields (excluding ID which is managed by JPA)
        message.setSender(sender);
        message.setReceiver(receiver);
        message.setContent(content);
        message.setTimestamp(timestamp);

        // Verify values
        assertNull(message.getId(), "ID should be null before persistence");
        assertEquals(sender, message.getSender());
        assertEquals(receiver, message.getReceiver());
        assertEquals(content, message.getContent());
        assertEquals(timestamp, message.getTimestamp());
    }
}
