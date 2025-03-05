package com.yucircle.community_service.service;

import java.util.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.yucircle.community_service.model.Profile;
import com.yucircle.community_service.model.ProfileTagsDTO;
import com.yucircle.community_service.model.Tag;
import com.yucircle.community_service.repositories.ProfileRepository;
import com.yucircle.community_service.repositories.TagRepository;

import jakarta.transaction.Transactional;

@Service
public class CommunityService {
	
	@Autowired
    private ProfileRepository profileRepository;
	
	@Autowired
	private TagRepository tagRepository;
	
	
	/**
	 * Create list of community 'profiles' 
	 * Profiles (or ProfileTagsDTO) contains profile info and a set of associated tags
	 * @return list of all ProfileTagsDTO 
	 */
    @Transactional
	public List<ProfileTagsDTO> getDefaultProfiles() {
    	
		List<ProfileTagsDTO> list = new ArrayList<ProfileTagsDTO>();
		
		for (Profile user: profileRepository.findAll()) 
		{
			ProfileTagsDTO pt = createProfileTagsDTO(user);
			list.add(pt);
		}
		
		return list;
	}
	
	/**
	 * Create list of Recommended Profiles
	 * Recommendations are based off profile's tags
	 * Any other profiles with any matching tag will get added to the list
	 * @param username, username to recommend profiles to
	 * @return list of recommended ProfileTagsDTO
	 * @throws Exception if username does not exist
	 */
    @Transactional
	public List<ProfileTagsDTO> getRecommendedProfiles(String username) throws Exception {
		
		//check if username exists
		if (!profileRepository.existsById(username)) {
			throw new Exception("username does not exist!");
		}
		
		//get all user tags
		Set<Tag> userTags = profileRepository.findById(username).get().getTags();
		
		//build set of recommendations
		Set<ProfileTagsDTO> recommendations = new HashSet<>();
		
		//get all users sharing username's tags
        for (Tag tag : userTags) {
        	//loop through all profiles listed under tag
        	for (Profile p : tagRepository.findById(tag.getTag()).get().getProfiles()) {
        		//add if profile doesn't belong to username
        		if (!p.getUsername().equals(username)) {
        			ProfileTagsDTO pt = createProfileTagsDTO(p);
        			recommendations.add(pt);
                }
        	}
        }
        
        //convert to list
        List<ProfileTagsDTO> listOfRecommendedUsers = new ArrayList<>();
        listOfRecommendedUsers.addAll(recommendations);
		
		return listOfRecommendedUsers;
	}
    
    /**
     * Convert Profile entity into DTO
     * Note: Entity to DTO conversion is required if returning a list of 'entities'
     * @param profile entity to convert into DTO
     * @return new ProfileTagsDTO
     */
    private ProfileTagsDTO createProfileTagsDTO(Profile profile) {
    	ProfileTagsDTO pt = new ProfileTagsDTO(profile);
		return pt;
    }
    
    /**
     * Filter through Profiles to find users with given tag
     * @param tag to filter for
     * @return list of profiles with tag, or empty list if tag does not exist
     */
    @Transactional
	public List<ProfileTagsDTO> filterTags(String tag) {
    	
    	List<ProfileTagsDTO> list = new ArrayList<>();
    	
    	//return empty list if Tag does not exist
    	if (!tagRepository.existsById(tag)) {
    		return list;
    	}
    	
    	for (Profile p : tagRepository.findById(tag).get().getProfiles()) {
    		ProfileTagsDTO pt = createProfileTagsDTO(p);
    		list.add(pt);
    	}
    	    	
    	return list;
    }

    /**
     * Queries profiles to search and find closest match
     * @param query to search/match with
     * @return list of possible matching profiles
     */
    @Transactional
	public List<ProfileTagsDTO> queryProfile(String query) {
		
		List<ProfileTagsDTO> list = new ArrayList<>();
		
		for (Profile p : profileRepository.findProfileBySearch(query)) {
			list.add(createProfileTagsDTO(p));
		}
		
		return list;
	}	
}
