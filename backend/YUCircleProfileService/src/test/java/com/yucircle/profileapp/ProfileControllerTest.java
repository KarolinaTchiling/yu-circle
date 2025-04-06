package com.yucircle.profileapp;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.yucircle.profileapp.controller.ProfileController;
import com.yucircle.profileapp.model.Profile;
import com.yucircle.profileapp.service.ProfileService;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.web.servlet.MockMvc;

import java.util.*;

import static org.hamcrest.Matchers.containsString;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ProfileController.class)
@ContextConfiguration(classes = { ProfileControllerTest.TestConfig.class })
public class ProfileControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ProfileService profileService;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Configuration
    static class TestConfig {
        @Bean
        public ProfileController profileController(ProfileService profileService) {
            return new ProfileController(profileService);
        }
    }

    private Profile createMockProfile() {
        Profile profile = new Profile();
        profile.setUsername("john123");
        profile.setPassword("pass");
        profile.setEmail("john@example.com");
        profile.setFirstname("John");
        profile.setLastname("Doe");
        profile.setYorkId("123456");
        profile.setPhoneNumber("1234567890");
        profile.setBio("Hello world!");
        profile.setProfilePictureUrl("http://example.com/pfp.jpg");
        return profile;
    }

    @Test
    void testGetAllProfiles() throws Exception {
        given(profileService.getAllProfiles()).willReturn(List.of(createMockProfile()));

        mockMvc.perform(get("/profiles"))
                .andExpect(status().isOk())
                .andExpect(content().string(containsString("john123")));
    }

    @Test
    void testGetProfileFound() throws Exception {
        given(profileService.getProfileByUsername("john123"))
                .willReturn(Optional.of(createMockProfile()));

        mockMvc.perform(get("/profiles/john123"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("john123"));
    }

    @Test
    void testGetProfileNotFound() throws Exception {
        given(profileService.getProfileByUsername("unknown"))
                .willReturn(Optional.empty());

        mockMvc.perform(get("/profiles/unknown"))
                .andExpect(status().isNotFound());
    }

    @Test
    void testCreateProfile() throws Exception {
        Profile mockProfile = createMockProfile();

        Map<String, String> request = new HashMap<>();
        request.put("username", "john123");
        request.put("password", "pass");
        request.put("email", "john@example.com");
        request.put("firstname", "John");
        request.put("lastname", "Doe");
        request.put("york_id", "123456");
        request.put("phone_number", "1234567890");
        request.put("bio", "Hello world!");

        given(profileService.createProfile(any(Profile.class))).willReturn(mockProfile);

        mockMvc.perform(post("/profiles")
                .contentType(APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("john123"));
    }

    @Test
    void testUpdateProfilePicture() throws Exception {
        given(profileService.updateProfilePictureUrl(eq("john123"), anyString()))
                .willReturn(true);

        mockMvc.perform(put("/profiles/pfp/john123")
                .contentType(APPLICATION_JSON)
                .content("{\"profilePictureUrl\":\"http://example.com/pfp.jpg\"}"))
                .andExpect(status().isOk())
                .andExpect(content().string("Profile Picture URL updated successfully."));
    }

    @Test
    void testUpdateBio() throws Exception {
        given(profileService.updateUserBio(eq("john123"), anyString()))
                .willReturn(true);

        mockMvc.perform(put("/profiles/bio/john123")
                .contentType(APPLICATION_JSON)
                .content("{\"bio\":\"Updated bio\"}"))
                .andExpect(status().isOk())
                .andExpect(content().string("Bio updated successfully."));
    }

    @Test
    void testLoginSuccess() throws Exception {
        Map<String, String> credentials = Map.of("username", "john123", "password", "pass");

        given(profileService.authenticateUser("john123", "pass")).willReturn(true);

        mockMvc.perform(post("/profiles/login")
                .contentType(APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(credentials)))
                .andExpect(status().isOk())
                .andExpect(content().string("Authentication successful"));
    }

    @Test
    void testLoginFailure() throws Exception {
        Map<String, String> credentials = Map.of("username", "john123", "password", "wrongpass");

        given(profileService.authenticateUser("john123", "wrongpass")).willReturn(false);

        mockMvc.perform(post("/profiles/login")
                .contentType(APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(credentials)))
                .andExpect(status().isUnauthorized())
                .andExpect(content().string("Invalid username or password"));
    }

    @Test
    void testDeleteProfile() throws Exception {
        mockMvc.perform(delete("/profiles/john123"))
                .andExpect(status().isNoContent());

        verify(profileService).deleteProfile("john123");
    }
}
