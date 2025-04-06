package com.yucircle.community_service;

import org.junit.jupiter.api.Test;
import com.yucircle.community_service.model.*;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

public class NotificationTest {

    @Test
    public void testIdGetterAndSetter() {
        Notification notification = new Notification();
        notification.setId(1L);
        assertEquals(1L, notification.getId());
    }

    @Test
    public void testUsernameGetterAndSetter() {
        Notification notification = new Notification();
        notification.setUsername("john_doe");
        assertEquals("john_doe", notification.getUsername());
    }

    @Test
    public void testMessageGetterAndSetter() {
        Notification notification = new Notification();
        notification.setMessage("You have a new message.");
        assertEquals("You have a new message.", notification.getMessage());
    }

    @Test
    public void testTimestampIsSetByDefault() {
        Notification notification = new Notification();
        assertNotNull(notification.getTimestamp());

        LocalDateTime now = LocalDateTime.now();
        assertTrue(notification.getTimestamp().isBefore(now.plusSeconds(1)));
        assertTrue(notification.getTimestamp().isAfter(now.minusSeconds(1)));
    }

    @Test
    public void testTimestampSetter() {
        Notification notification = new Notification();
        LocalDateTime customTime = LocalDateTime.of(2023, 1, 1, 12, 0);
        notification.setTimestamp(customTime);
        assertEquals(customTime, notification.getTimestamp());
    }
}
