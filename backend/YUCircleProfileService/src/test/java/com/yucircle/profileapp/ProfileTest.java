package com.yucircle.profileapp;

import com.yucircle.profileapp.model.Profile;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class ProfileTest {

    @Test
    void testProfileGettersAndSetters() {
        Profile profile = new Profile();

        profile.setUsername("john123");
        profile.setPassword("securepass");
        profile.setYorkId("y1234567");
        profile.setFirstname("John");
        profile.setLastname("Doe");
        profile.setEmail("john@example.com");
        profile.setPhoneNumber("123-456-7890");
        profile.setIsAdmin(true);
        profile.setBio("This is my bio");
        profile.setProfilePictureUrl("http://example.com/profile.jpg");

        assertEquals("john123", profile.getUsername());
        assertEquals("securepass", profile.getPassword());
        assertEquals("y1234567", profile.getYorkId());
        assertEquals("John", profile.getFirstname());
        assertEquals("Doe", profile.getLastname());
        assertEquals("john@example.com", profile.getEmail());
        assertEquals("123-456-7890", profile.getPhoneNumber());
        assertTrue(profile.getIsAdmin());
        assertEquals("This is my bio", profile.getBio());
        assertEquals("http://example.com/profile.jpg", profile.getProfilePictureUrl());
    }
}
