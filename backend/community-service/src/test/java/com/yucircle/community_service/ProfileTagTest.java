package com.yucircle.community_service;

import com.yucircle.community_service.model.Profile;
import com.yucircle.community_service.model.ProfileTag;
import com.yucircle.community_service.model.Tag;
import org.junit.jupiter.api.Test;

import java.lang.reflect.Constructor;

import static org.junit.jupiter.api.Assertions.*;

class ProfileTagTest {

    private Profile createProfile() {
        try {
            Constructor<Profile> constructor = Profile.class.getDeclaredConstructor();
            constructor.setAccessible(true);
            Profile profile = constructor.newInstance();
            profile.setUsername("john_doe");
            return profile;
        } catch (Exception e) {
            throw new RuntimeException("Failed to create Profile instance", e);
        }
    }

    private Tag createTag() {
        try {
            Constructor<Tag> constructor = Tag.class.getDeclaredConstructor();
            constructor.setAccessible(true);
            Tag tag = constructor.newInstance();
            // Optionally set fields if needed, depending on the class design
            return tag;
        } catch (Exception e) {
            throw new RuntimeException("Failed to create Tag instance", e);
        }
    }

    @Test
    void testConstructorAndGetters() {
        Profile profile = createProfile();
        Tag tag = createTag();

        ProfileTag profileTag = new ProfileTag(profile, tag);

        assertEquals(profile, profileTag.getProfile());
        assertEquals(tag, profileTag.getTag());
        assertNull(profileTag.getId());
    }

    @Test
    void testSetters() {
        Profile profile = createProfile();
        Tag tag = createTag();
        ProfileTag profileTag = new ProfileTag(profile, tag);

        profileTag.setId(10L);
        assertEquals(10L, profileTag.getId());

        Profile anotherProfile = createProfile();
        anotherProfile.setUsername("jane_doe");
        profileTag.setProfile(anotherProfile);
        assertEquals("jane_doe", profileTag.getProfile().getUsername());

        Tag anotherTag = createTag();
        profileTag.setTag(anotherTag);
        assertEquals(anotherTag, profileTag.getTag());
    }

    @Test
    void testToString() {
        Profile profile = createProfile();
        profile.setUsername("user123");

        Tag tag = createTag();
        ProfileTag profileTag = new ProfileTag(profile, tag);

        String result = profileTag.toString();
        assertTrue(result.contains("ProfileTag"));
        assertTrue(result.contains("user123"));
    }
}
