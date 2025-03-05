package com.yucircle.community_service.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.yucircle.community_service.model.Profile;
import com.yucircle.community_service.model.ProfileTag;
import com.yucircle.community_service.model.Tag;
import com.yucircle.community_service.repositories.ProfileRepository;
import com.yucircle.community_service.repositories.ProfileTagRepository;
import com.yucircle.community_service.repositories.TagRepository;

import jakarta.transaction.Transactional;

@Service
public class ProfileTaggingService {
	
	@Autowired
    private ProfileRepository profileRepository;
	
	@Autowired
	private TagRepository tagRepository;
	
	@Autowired
	private ProfileTagRepository ptRepository;
	
	
	/**
	 * Get all tags belonging to a profile
	 * @param username String of profile username 
	 * @return list of tags under a profile
	 */
	@Transactional
	public List<String> getProfileTags(String username) {
		
		List<String> list = new ArrayList<String>();
		
		//convert tags entity into list of strings
		for (Tag t : profileRepository.findById(username).get().getTags()) {
			list.add(t.getTag());
		}
		
		return list;
	}
	
	/**
	 * Add new relationship between a Profile and Tag
	 * @param username String of profile username
	 * @param tagString String of tag to add
	 * @throws Exception if profile does not exist, or if duplicate exists
	 */
	@Transactional
	public void addProfileTag(String username, String tagString) throws Exception {
		
		//find profile		
		Profile profile = profileRepository.findById(username)
		        .orElseThrow(() -> new Exception("profile does not exist!"));
		
		//find tag, or create one if it does not exist
	    Tag tag = tagRepository.findById(tagString)
	    		.orElseGet(() -> {
	    			Tag newTag = new Tag(tagString);
	    			return tagRepository.save(newTag);
	    		});

		//add new profile tag relationship
		try {
			ProfileTag newPT = new ProfileTag(profile, tag);
			ptRepository.save(newPT);
		}
		catch (Exception e) {
			throw new Exception(e.getMessage());
		}
	}
	
	/**
	 * Removes tag from profile if it exists
	 * @param username of profile to remove tag from
	 * @param tag to remove
	 * @throws Exception if username or tag does not exist
	 */
	@Transactional
	public void removeProfileTag(String username, String tagString) throws Exception {
		
		//find profile		
		Profile profile = profileRepository.findById(username)
		        .orElseThrow(() -> new Exception("profile does not exist!"));
		
		//find tag
	    Tag tag = tagRepository.findById(tagString)
	        .orElseThrow(() -> new Exception("tag not found"));
		
	    ptRepository.deleteByProfileAndTag(profile, tag);
	}
	
}
