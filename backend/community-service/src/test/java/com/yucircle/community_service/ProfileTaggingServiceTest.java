package com.yucircle.community_service;

import com.yucircle.community_service.model.Profile;
import com.yucircle.community_service.model.ProfileTag;
import com.yucircle.community_service.model.Tag;
import com.yucircle.community_service.repositories.ProfileRepository;
import com.yucircle.community_service.repositories.ProfileTagRepository;
import com.yucircle.community_service.repositories.TagRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import com.yucircle.community_service.model.*;
import com.yucircle.community_service.repositories.*;
import com.yucircle.community_service.service.ProfileTaggingService;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ProfileTaggingServiceTest {

    @InjectMocks
    private ProfileTaggingService profileTaggingService;

    @Mock
    private ProfileRepository profileRepository;

    @Mock
    private TagRepository tagRepository;

    @Mock
    private ProfileTagRepository ptRepository;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetProfileTags() {
        // Setup mock Profile with Tags
        Profile profile = mock(Profile.class);
        Tag tag1 = new Tag("sports");
        Tag tag2 = new Tag("tech");

        Set<Tag> tagSet = new HashSet<>(Arrays.asList(tag1, tag2));
        when(profile.getTags()).thenReturn(tagSet);
        when(profileRepository.findById("john_doe")).thenReturn(Optional.of(profile));

        List<String> tags = profileTaggingService.getProfileTags("john_doe");

        assertEquals(2, tags.size());
        assertTrue(tags.contains("sports"));
        assertTrue(tags.contains("tech"));
    }

    @Test
    void testAddProfileTag_NewTag() throws Exception {
        Profile profile = mock(Profile.class);
        when(profileRepository.findById("john_doe")).thenReturn(Optional.of(profile));
        when(tagRepository.findById("gaming")).thenReturn(Optional.empty());

        Tag newTag = new Tag("gaming");
        when(tagRepository.save(any(Tag.class))).thenReturn(newTag);

        profileTaggingService.addProfileTag("john_doe", "gaming");

        verify(ptRepository).save(any(ProfileTag.class));
    }

    @Test
    void testAddProfileTag_ProfileNotFound() {
        when(profileRepository.findById("ghost")).thenReturn(Optional.empty());

        Exception ex = assertThrows(Exception.class, () -> profileTaggingService.addProfileTag("ghost", "sports"));

        assertEquals("profile does not exist!", ex.getMessage());
    }

    @Test
    void testRemoveProfileTag_Success() throws Exception {
        Profile profile = mock(Profile.class);
        Tag tag = new Tag("travel");

        when(profileRepository.findById("jane_doe")).thenReturn(Optional.of(profile));
        when(tagRepository.findById("travel")).thenReturn(Optional.of(tag));

        profileTaggingService.removeProfileTag("jane_doe", "travel");

        verify(ptRepository).deleteByProfileAndTag(profile, tag);
    }

    @Test
    void testRemoveProfileTag_ProfileNotFound() {
        when(profileRepository.findById("invalid_user")).thenReturn(Optional.empty());

        Exception ex = assertThrows(Exception.class,
                () -> profileTaggingService.removeProfileTag("invalid_user", "food"));

        assertEquals("profile does not exist!", ex.getMessage());
    }

    @Test
    void testRemoveProfileTag_TagNotFound() {
        Profile profile = mock(Profile.class);
        when(profileRepository.findById("john_doe")).thenReturn(Optional.of(profile));
        when(tagRepository.findById("nonexistent")).thenReturn(Optional.empty());

        Exception ex = assertThrows(Exception.class,
                () -> profileTaggingService.removeProfileTag("john_doe", "nonexistent"));

        assertEquals("tag not found", ex.getMessage());
    }
}
