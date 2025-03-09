package com.yucircle.profileapp.controller;
import com.yucircle.profileapp.model.Profile;
import com.yucircle.profileapp.service.ProfileService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
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
    
    @GetMapping("/bio/{username}")
    public ResponseEntity<String> getUserBio(@PathVariable String username) {
        String bio = profileService.getUserBio(username);
        if (bio != null) {
            return ResponseEntity.ok(bio);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    // @PostMapping handles POST requests.
    // @RequestBody for binding request to parameter.
    @PostMapping
    public Profile createProfile(@RequestBody Map<String, String> request) {
    	Profile profile = new Profile();
    	profile.setUsername(request.get("username"));
    	profile.setPassword(request.get("password"));
    	profile.setEmail(request.get("email"));
    	profile.setFirstname(request.get("firstname"));
    	profile.setLastname(request.get("lastname"));
    	profile.setYorkId(request.get("york_id"));
    	profile.setPhoneNumber(request.get("phone_number"));
    	profile.setBio(request.get("bio"));
    	
    	
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
    
    @PutMapping("/changepass/{username}")
    public ResponseEntity<String> changePassword(@PathVariable String username, @RequestBody Map<String, String> request) {
    	String newPassword = request.get("password");
    	profileService.changePassword(username, newPassword, newPassword);

        return ResponseEntity.ok("Password updated successfully.");
    }
    
    @PutMapping("/bio/{username}")
    public ResponseEntity<String> updateUserBio(@PathVariable String username, @RequestBody Map<String, String> request) {
        String newBio = request.get("bio");
        boolean updated = profileService.updateUserBio(username, newBio);
        
        if (updated) {
            return ResponseEntity.ok("Bio updated successfully.");
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    // @DeleteMapping handles DELETE requests.
    @DeleteMapping("/{username}")
    public ResponseEntity<Void> deleteProfile(@PathVariable String username) {
        profileService.deleteProfile(username);
        return ResponseEntity.noContent().build();
    }
    
  // Handles authentication.
  @PostMapping("/login")
  public ResponseEntity<String> login(@RequestBody Map<String, String> loginRequest) {
      boolean authenticated = profileService.authenticateUser(loginRequest.get("username"), loginRequest.get("password"));

      if (authenticated) {
          return ResponseEntity.ok("Authentication successful");
      } else {
          return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password");
      }
  }
    
}