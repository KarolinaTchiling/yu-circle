package com.yucircle.profileapp.controller;

import com.yucircle.profileapp.model.Profile;
import com.yucircle.profileapp.service.ProfileService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/profiles")
public class ProfileController {

    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
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
//        return profile.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
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
    
    // @DeleteMapping handles DELETE requests.
    @DeleteMapping("/{username}")
    public ResponseEntity<Void> deleteProfile(@PathVariable String username) {
        profileService.deleteProfile(username);
        return ResponseEntity.noContent().build();
    }
}