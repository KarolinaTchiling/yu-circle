package com.yucircle.marketplaceapp;

import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;
import com.yucircle.marketplaceapp.model.Notification;

public class NotificationTest {

    @Test
    void testDefaultTimestampIsInitialized() {
        Notification notification = new Notification();
        assertNotNull(notification.getTimestamp(), "Timestamp should be initialized by default");
    }

    @Test
    void testSetAndGetId() {
        Notification notification = new Notification();
        notification.setId(101L);
        assertEquals(101L, notification.getId());
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
        notification.setMessage("You received a message");
        assertEquals("You received a message", notification.getMessage());
    }

    @Test
    void testSetAndGetTimestamp() {
        Notification notification = new Notification();
        LocalDateTime customTime = LocalDateTime.of(2024, 1, 1, 12, 0);
        notification.setTimestamp(customTime);
        assertEquals(customTime, notification.getTimestamp());
    }
}
