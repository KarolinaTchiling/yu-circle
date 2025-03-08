package com.yucircle.profileapp.service;

import com.yucircle.profileapp.model.Profile;
import com.yucircle.profileapp.repository.ProfileRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProfileService {

    private final ProfileRepository profileRepository;

    public ProfileService(ProfileRepository profileRepository) {
        this.profileRepository = profileRepository;
    }

    // Get All Profiles
    public List<Profile> getAllProfiles() {
        return profileRepository.findAll();
    }

    // Get Profile by Username
    public Optional<Profile> getProfileByUsername(String username) {
        return profileRepository.findById(username);
    }

    // Create Profile
    public Profile createProfile(Profile profile) {
        return profileRepository.save(profile);
    }

    // Update Profile
    public Profile updateProfile(String username, Profile updatedProfile) {
        Optional<Profile> optionalProfile = profileRepository.findById(username);
        if (optionalProfile.isPresent()) {

            Profile profile = optionalProfile.get();

            if (updatedProfile.getPassword() != null) profile.setPassword(updatedProfile.getPassword());
            if (updatedProfile.getFirstname() != null) profile.setFirstname(updatedProfile.getFirstname());
            if (updatedProfile.getLastname() != null) profile.setLastname(updatedProfile.getLastname());
            if (updatedProfile.getEmail() != null) profile.setEmail(updatedProfile.getEmail());
            if (updatedProfile.getPhoneNumber() != null) profile.setPhoneNumber(updatedProfile.getPhoneNumber());
            if (updatedProfile.getIsAdmin() != null) profile.setIsAdmin(updatedProfile.getIsAdmin());

            return profileRepository.save(profile);

        } else {
            throw new RuntimeException("Profile not found, or does not exist!");
        }
    }

    // Delete Profile
    public void deleteProfile(String username) {
        profileRepository.deleteById(username);
    }

    // Authenticating User
    public boolean authenticateUser(String username, String password) {
        Optional<Profile> optionalProfile = this.getProfileByUsername(username);

        if (optionalProfile.isPresent()) {
            Profile profile = optionalProfile.get();

            // Password hashing to be added here!!!
            return password.equals(profile.getPassword());
        }
        return false; // User not found, or does not exist.
    }

    // Save profile updates
    public void saveProfile(Profile profile) {
        profileRepository.save(profile);
    }

    public boolean resetPasswordByUsername(String username, String newPassword) {
        Optional<Profile> optionalProfile = profileRepository.findById(username);
        if (optionalProfile.isPresent()) {
            Profile profile = optionalProfile.get();
            profile.setPassword(newPassword); // ⚠️ Should hash in real applications
            profileRepository.save(profile);
            return true;
        }
        return false;
    }

}