package com.yucircle.community_service;

import com.yucircle.community_service.model.*;
import com.yucircle.community_service.repositories.ProfileRepository;
import com.yucircle.community_service.repositories.TagRepository;
import com.yucircle.community_service.service.CommunityService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class CommunityServiceTest {

    @Mock
    private ProfileRepository profileRepository;

    @Mock
    private TagRepository tagRepository;

    @InjectMocks
    private CommunityService communityService;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testGetDefaultProfiles() {
        Profile profile = mock(Profile.class);
        when(profile.getUsername()).thenReturn("john");
        when(profile.getTags()).thenReturn(Collections.emptySet());

        when(profileRepository.findAll()).thenReturn(List.of(profile));

        List<ProfileTagsDTO> result = communityService.getDefaultProfiles(Optional.empty());

        assertEquals(1, result.size());
        assertEquals("john", result.get(0).getUsername());
    }

    @Test
    public void testGetRecommendedProfilesSuccess() throws Exception {
        Tag tag = mock(Tag.class);
        Profile profile = mock(Profile.class);
        Profile otherUser = mock(Profile.class);

        when(profile.getUsername()).thenReturn("john");
        when(otherUser.getUsername()).thenReturn("jane");

        when(profile.getTags()).thenReturn(Set.of(tag));
        when(tag.getTag()).thenReturn("Tech");
        when(tag.getProfiles()).thenReturn(Set.of(profile, otherUser));

        when(profileRepository.existsById("john")).thenReturn(true);
        when(profileRepository.findById("john")).thenReturn(Optional.of(profile));
        when(tagRepository.findById("Tech")).thenReturn(Optional.of(tag));

        List<ProfileTagsDTO> result = communityService.getRecommendedProfiles("john", Optional.empty());

        assertEquals(1, result.size());
        assertEquals("jane", result.get(0).getUsername());
    }

    @Test
    public void testGetRecommendedProfilesThrowsIfNotFound() {
        when(profileRepository.existsById("ghost")).thenReturn(false);

        Exception e = assertThrows(Exception.class,
                () -> communityService.getRecommendedProfiles("ghost", Optional.empty()));

        assertEquals("username does not exist!", e.getMessage());
    }

    @Test
    public void testFilterTagsReturnsMatch() {
        Profile profile = mock(Profile.class);
        Tag tag1 = mock(Tag.class);
        Tag tag2 = mock(Tag.class);

        when(tag1.getTag()).thenReturn("CS");
        when(tag2.getTag()).thenReturn("Undergrad");
        when(profile.getUsername()).thenReturn("tester");
        when(profile.getTags()).thenReturn(Set.of(tag1, tag2));

        when(profileRepository.findAll()).thenReturn(List.of(profile));

        List<ProfileTagsDTO> result = communityService.filterTags(
                List.of("CS"),
                List.of("Undergrad"),
                Optional.empty());

        assertEquals(1, result.size());
        assertEquals("tester", result.get(0).getUsername());
    }

    @Test
    public void testQueryProfileReturnsList() {
        Profile profile = mock(Profile.class);
        when(profile.getUsername()).thenReturn("alice");
        when(profile.getTags()).thenReturn(Collections.emptySet());

        when(profileRepository.findProfileBySearch("ali")).thenReturn(List.of(profile));

        List<ProfileTagsDTO> result = communityService.queryProfile("ali", Optional.empty());

        assertEquals(1, result.size());
        assertEquals("alice", result.get(0).getUsername());
    }
}
