package com.yucircle.community_service;

import com.yucircle.community_service.model.Profile;
import com.yucircle.community_service.model.Tag;
import org.junit.jupiter.api.Test;

import java.lang.reflect.Constructor;
import java.util.HashSet;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

class ProfileTest {

    // Helper method to create Profile using reflection
    private Profile createProfile() {
        try {
            Constructor<Profile> constructor = Profile.class.getDeclaredConstructor();
            constructor.setAccessible(true);
            return constructor.newInstance();
        } catch (Exception e) {
            throw new RuntimeException("Failed to create Profile instance", e);
        }
    }

    @Test
    void testSetAndGetUsername() {
        Profile profile = createProfile();
        profile.setUsername("john_doe");
        assertEquals("john_doe", profile.getUsername());
    }

    @Test
    void testSetAndGetYorkId() {
        Profile profile = createProfile();
        profile.setYorkId("y1234567");
        assertEquals("y1234567", profile.getYorkId());
    }

    @Test
    void testSetAndGetFirstname() {
        Profile profile = createProfile();
        profile.setFirstname("John");
        assertEquals("John", profile.getFirstname());
    }

    @Test
    void testSetAndGetLastname() {
        Profile profile = createProfile();
        profile.setLastname("Doe");
        assertEquals("Doe", profile.getLastname());
    }

    @Test
    void testSetAndGetEmail() {
        Profile profile = createProfile();
        profile.setEmail("john@example.com");
        assertEquals("john@example.com", profile.getEmail());
    }

    @Test
    void testSetAndGetPhoneNumber() {
        Profile profile = createProfile();
        profile.setPhoneNumber("123-456-7890");
        assertEquals("123-456-7890", profile.getPhoneNumber());
    }

    @Test
    void testDefaultIsAdminIsFalse() {
        Profile profile = createProfile();
        assertFalse(profile.getIsAdmin());
    }

    @Test
    void testSetAndGetIsAdmin() {
        Profile profile = createProfile();
        profile.setIsAdmin(true);
        assertTrue(profile.getIsAdmin());
    }

    @Test
    void testSetAndGetTags() {
        Profile profile = createProfile();
        Set<Tag> tags = new HashSet<>();
        tags.add(new Tag("sports"));
        tags.add(new Tag("music"));

        profile.setTags(tags);
        assertEquals(2, profile.getTags().size());
    }

    @Test
    void testToStringReturnsUsername() {
        Profile profile = createProfile();
        profile.setUsername("john_doe");
        assertEquals("john_doe", profile.toString());
    }
}
