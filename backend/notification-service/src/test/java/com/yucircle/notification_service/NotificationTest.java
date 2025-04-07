package com.yucircle.notification_service;

import com.yucircle.notification_service.model.Notification;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

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
        notification.setUsername("john_doe");
        assertEquals("john_doe", notification.getUsername());
    }

    @Test
    void testSetAndGetMessage() {
        Notification notification = new Notification();
        notification.setMessage("New message received");
        assertEquals("New message received", notification.getMessage());
    }

    @Test
    void testDefaultTimestampIsInitialized() {
        Notification notification = new Notification();
        assertNotNull(notification.getTimestamp());
        assertTrue(notification.getTimestamp().isBefore(LocalDateTime.now().plusSeconds(2)));
    }

    @Test
    void testSetAndGetTimestamp() {
        Notification notification = new Notification();
        LocalDateTime customTime = LocalDateTime.of(2024, 5, 1, 12, 0);
        notification.setTimestamp(customTime);
        assertEquals(customTime, notification.getTimestamp());
    }
}
