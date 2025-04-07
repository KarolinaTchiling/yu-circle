package com.yucircle.community_service;

import com.yucircle.community_service.model.Profile;
import com.yucircle.community_service.repositories.ProfileRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class ProfileRepositoryTest {

    private ProfileRepository profileRepository;

    @BeforeEach
    public void setup() {
        profileRepository = mock(ProfileRepository.class);
    }

    @Test
    public void testFindProfileBySearch_returnsResults() {
        Profile mockProfile = mock(Profile.class);
        when(mockProfile.getUsername()).thenReturn("john123");

        when(profileRepository.findProfileBySearch("john"))
                .thenReturn(List.of(mockProfile));

        List<Profile> results = profileRepository.findProfileBySearch("john");

        assertEquals(1, results.size());
        assertEquals("john123", results.get(0).getUsername());
    }

    @Test
    public void testFindProfileBySearch_returnsEmpty() {
        when(profileRepository.findProfileBySearch("zzz"))
                .thenReturn(List.of());

        List<Profile> results = profileRepository.findProfileBySearch("zzz");

        assertTrue(results.isEmpty());
    }
}
