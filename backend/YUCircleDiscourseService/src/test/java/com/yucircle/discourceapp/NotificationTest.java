package com.yucircle.discourceapp;

import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import com.yucircle.discourceapp.model.Notification;

import static org.junit.jupiter.api.Assertions.*;

class NotificationTest {

    @Test
    void testSetAndGetId() {
        Notification notification = new Notification();
        notification.setId(1L);
        assertEquals(1L, notification.getId());
    }

    @Test
    void testSetAndGetUsername() {
        Notification notification = new Notification();
        notification.setUsername("mehregan");
        assertEquals("mehregan", notification.getUsername());
    }

    @Test
    void testSetAndGetMessage() {
        Notification notification = new Notification();
        notification.setMessage("New comment on your post");
        assertEquals("New comment on your post", notification.getMessage());
    }

    @Test
    void testDefaultTimestampInitialization() {
        Notification notification = new Notification();
        assertNotNull(notification.getTimestamp());
        assertTrue(notification.getTimestamp().isBefore(LocalDateTime.now().plusSeconds(2)));
    }

    @Test
    void testSetAndGetTimestamp() {
        Notification notification = new Notification();
        LocalDateTime customTimestamp = LocalDateTime.of(2023, 10, 5, 15, 30);
        notification.setTimestamp(customTimestamp);
        assertEquals(customTimestamp, notification.getTimestamp());
    }
}
