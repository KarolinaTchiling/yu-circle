
package com.yucircle.community_service;

import com.yucircle.community_service.model.Profile;
import com.yucircle.community_service.model.Tag;
import org.junit.jupiter.api.Test;

import java.lang.reflect.Constructor;
import java.util.HashSet;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

class TagTest {

    private Tag createTagUsingReflection() {
        try {
            Constructor<Tag> constructor = Tag.class.getDeclaredConstructor();
            constructor.setAccessible(true);
            return constructor.newInstance();
        } catch (Exception e) {
            throw new RuntimeException("Failed to create Tag instance", e);
        }
    }

    private Profile createProfileUsingReflection(String username) {
        try {
            Constructor<Profile> constructor = Profile.class.getDeclaredConstructor();
            constructor.setAccessible(true);
            Profile profile = constructor.newInstance();
            profile.setUsername(username);
            return profile;
        } catch (Exception e) {
            throw new RuntimeException("Failed to create Profile instance", e);
        }
    }

    @Test
    void testParameterizedConstructor() {
        Tag tag = new Tag("sports");
        assertEquals("sports", tag.getTag());
    }

    @Test
    void testSetAndGetTag() {
        Tag tag = createTagUsingReflection();
        tag.setTag("music");
        assertEquals("music", tag.getTag());
    }

    @Test
    void testSetAndGetProfiles() {
        Tag tag = createTagUsingReflection();

        Profile profile1 = createProfileUsingReflection("john_doe");
        Profile profile2 = createProfileUsingReflection("jane_doe");

        Set<Profile> profiles = new HashSet<>();
        profiles.add(profile1);
        profiles.add(profile2);

        tag.setProfiles(profiles);

        assertEquals(2, tag.getProfiles().size());
        assertTrue(tag.getProfiles().contains(profile1));
        assertTrue(tag.getProfiles().contains(profile2));
    }

    @Test
    void testToString() {
        Tag tag = new Tag("tech");
        assertEquals("tech", tag.toString());
    }
}
