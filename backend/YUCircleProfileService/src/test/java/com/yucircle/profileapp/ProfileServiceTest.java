package com.yucircle.profileapp;

import com.yucircle.profileapp.service.*;
import com.yucircle.profileapp.model.Profile;
import com.yucircle.profileapp.repository.ProfileRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ProfileServiceTest {

    private ProfileRepository profileRepository;
    private ProfileService profileService;

    @BeforeEach
    void setUp() {
        profileRepository = mock(ProfileRepository.class);
        profileService = new ProfileService(profileRepository);
    }

    private Profile mockProfile() {
        Profile profile = new Profile();
        profile.setUsername("john123");
        profile.setPassword("pass");
        profile.setFirstname("John");
        profile.setLastname("Doe");
        profile.setEmail("john@example.com");
        profile.setPhoneNumber("1234567890");
        profile.setYorkId("y123456");
        profile.setBio("My bio");
        profile.setProfilePictureUrl("http://example.com/pic.jpg");
        return profile;
    }

    @Test
    void testGetAllProfiles() {
        when(profileRepository.findAll()).thenReturn(List.of(mockProfile()));
        List<Profile> profiles = profileService.getAllProfiles();

        assertEquals(1, profiles.size());
        assertEquals("john123", profiles.get(0).getUsername());
    }

    @Test
    void testGetProfileByUsername_Found() {
        when(profileRepository.findById("john123")).thenReturn(Optional.of(mockProfile()));
        Optional<Profile> result = profileService.getProfileByUsername("john123");

        assertTrue(result.isPresent());
        assertEquals("john123", result.get().getUsername());
    }

    @Test
    void testGetProfileByUsername_NotFound() {
        when(profileRepository.findById("notfound")).thenReturn(Optional.empty());
        Optional<Profile> result = profileService.getProfileByUsername("notfound");

        assertFalse(result.isPresent());
    }

    @Test
    void testGetUserBio() {
        when(profileRepository.findById("john123")).thenReturn(Optional.of(mockProfile()));
        String bio = profileService.getUserBio("john123");

        assertEquals("My bio", bio);
    }

    @Test
    void testCreateProfile() {
        Profile profile = mockProfile();
        when(profileRepository.save(profile)).thenReturn(profile);

        Profile created = profileService.createProfile(profile);
        assertEquals("john123", created.getUsername());
    }

    @Test
    void testUpdateProfile_Success() {
        Profile updated = mockProfile();
        updated.setFirstname("Johnny");
        when(profileRepository.findById("john123")).thenReturn(Optional.of(mockProfile()));
        when(profileRepository.save(any(Profile.class))).thenReturn(updated);

        Profile result = profileService.updateProfile("john123", updated);
        assertEquals("Johnny", result.getFirstname());
    }

    @Test
    void testUpdateProfile_NotFound() {
        when(profileRepository.findById("unknown")).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> {
            profileService.updateProfile("unknown", mockProfile());
        });
    }

    @Test
    void testChangePassword_Success() {
        Profile profile = mockProfile();
        when(profileRepository.findById("john123")).thenReturn(Optional.of(profile));
        when(profileRepository.save(any())).thenReturn(profile);

        Profile updated = profileService.changePassword("john123", "old", "newPass");
        assertEquals("newPass", updated.getPassword());
    }

    @Test
    void testChangePassword_NotFound() {
        when(profileRepository.findById("unknown")).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> {
            profileService.changePassword("unknown", "old", "new");
        });
    }

    @Test
    void testDeleteProfile() {
        profileService.deleteProfile("john123");
        verify(profileRepository).deleteById("john123");
    }

    @Test
    void testAuthenticateUser_Success() {
        Profile profile = mockProfile();
        when(profileRepository.findById("john123")).thenReturn(Optional.of(profile));

        boolean auth = profileService.authenticateUser("john123", "pass");
        assertTrue(auth);
    }

    @Test
    void testAuthenticateUser_Fail() {
        Profile profile = mockProfile();
        when(profileRepository.findById("john123")).thenReturn(Optional.of(profile));

        boolean auth = profileService.authenticateUser("john123", "wrong");
        assertFalse(auth);
    }

    @Test
    void testAuthenticateUser_NotFound() {
        when(profileRepository.findById("ghost")).thenReturn(Optional.empty());

        boolean auth = profileService.authenticateUser("ghost", "any");
        assertFalse(auth);
    }

    @Test
    void testUpdateUserBio_Success() {
        Profile profile = mockProfile();
        when(profileRepository.findById("john123")).thenReturn(Optional.of(profile));
        when(profileRepository.save(profile)).thenReturn(profile);

        boolean result = profileService.updateUserBio("john123", "New bio");
        assertTrue(result);
        assertEquals("New bio", profile.getBio());
    }

    @Test
    void testUpdateUserBio_NotFound() {
        when(profileRepository.findById("unknown")).thenReturn(Optional.empty());

        boolean result = profileService.updateUserBio("unknown", "New bio");
        assertFalse(result);
    }

    @Test
    void testUpdateProfilePictureUrl_Success() {
        Profile profile = mockProfile();
        when(profileRepository.findById("john123")).thenReturn(Optional.of(profile));
        when(profileRepository.save(profile)).thenReturn(profile);

        boolean result = profileService.updateProfilePictureUrl("john123", "http://pic.com/new.jpg");
        assertTrue(result);
        assertEquals("http://pic.com/new.jpg", profile.getProfilePictureUrl());
    }

    @Test
    void testUpdateProfilePictureUrl_NotFound() {
        when(profileRepository.findById("unknown")).thenReturn(Optional.empty());

        boolean result = profileService.updateProfilePictureUrl("unknown", "url");
        assertFalse(result);
    }
}
