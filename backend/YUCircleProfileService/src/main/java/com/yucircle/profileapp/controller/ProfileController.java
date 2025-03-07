package com.yucircle.profileapp.controller;

import com.yucircle.profileapp.model.Profile;
import com.yucircle.profileapp.service.ProfileService;
import com.yucircle.profileapp.service.EmailService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/profiles")
public class ProfileController {

    private final ProfileService profileService;

    public ProfileController(ProfileService profileService, EmailService emailService) {
        this.profileService = profileService;
    }

    // @GetMapping for GET requests.
    @GetMapping
    public List<Profile> getAllProfiles() {
        return profileService.getAllProfiles();
    }

    // @PathVariable for binding the parameter to the URL.
    @GetMapping("/{username}")
    public ResponseEntity<Profile> getProfile(@PathVariable String username) {
        Optional<Profile> optionalProfile = profileService.getProfileByUsername(username);
        if (optionalProfile.isPresent()) {
            return ResponseEntity.ok(optionalProfile.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // @PostMapping handles POST requests.
    // @RequestBody for binding request to parameter.
    @PostMapping
    public Profile createProfile(@RequestBody Profile profile) {
        return profileService.createProfile(profile);
    }

    // @PutMapping handles PUT requests.
    @PutMapping("/{username}")
    public ResponseEntity<Profile> updateProfile(@PathVariable String username, @RequestBody Profile profile) {
        try {
            Profile updatedProfile = profileService.updateProfile(username, profile);
            return ResponseEntity.ok(updatedProfile);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // @PostMapping handles setting a new password.
    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestParam String username, @RequestParam String newPassword) {
        boolean success = profileService.resetPasswordByUsername(username, newPassword);
        if (success) {
            return ResponseEntity.ok("Password reset successful");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
    }

}
