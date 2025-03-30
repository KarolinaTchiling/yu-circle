package com.yucircle.profileapp.service;

import com.yucircle.profileapp.model.Profile;
import com.yucircle.profileapp.repository.ProfileRepository;

import jakarta.transaction.Transactional;

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
    
    public String getUserBio(String username) {
        return profileRepository.findById(username)
                .map(Profile::getBio)
                .orElse("");
    }
    
    // Create Profile
    public Profile createProfile(Profile profile) {
        return profileRepository.save(profile);
    }
    
    // Update Profile
    @Transactional
    public Profile updateProfile(String username, Profile updatedProfile) {
    	Optional<Profile> optionalProfile = profileRepository.findById(username);
    	if (optionalProfile.isPresent()) {
    		
    	    Profile profile = optionalProfile.get();
    	    
    	    profile.setFirstname(updatedProfile.getFirstname());
    	    profile.setLastname(updatedProfile.getLastname());
    	    profile.setEmail(updatedProfile.getEmail());
    	    profile.setPhoneNumber(updatedProfile.getPhoneNumber());
            profile.setYorkId(updatedProfile.getYorkId());
    	    
    	    return profileRepository.save(profile);
    	    
    	} else {
    	    throw new RuntimeException("Profile not found, or does not exist!");
    	}
    }
    
    @Transactional
    public Profile changePassword(String username, String oldPassword, String newPassword) {
        Optional<Profile> optionalProfile = profileRepository.findById(username);

    	if (optionalProfile.isPresent()) {
    	    Profile profile = optionalProfile.get();
    	    profile.setPassword(newPassword);
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

    public boolean updateUserBio(String username, String newBio) {
        Optional<Profile> optionalProfile = profileRepository.findById(username);
        
        if (optionalProfile.isPresent()) {
            Profile profile = optionalProfile.get();
            profile.setBio(newBio);
            profileRepository.save(profile);
            return true;
        }
        
        return false;
    }

	public boolean updateProfilePictureUrl(String username, String profilePictureUrl) {
		Optional<Profile> optionalProfile = profileRepository.findById(username);
        
        if (optionalProfile.isPresent()) {
            Profile profile = optionalProfile.get();
            profile.setProfilePictureUrl(profilePictureUrl);
            profileRepository.save(profile);
            return true;
        }
        
        return false;
	}
}
