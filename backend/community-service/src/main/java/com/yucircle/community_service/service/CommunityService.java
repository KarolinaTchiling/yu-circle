package com.yucircle.community_service.service;

import java.util.*;
import java.util.stream.Collectors;

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
	public List<ProfileTagsDTO> getDefaultProfiles(Optional<String> sort) {
    	
		List<ProfileTagsDTO> list = new ArrayList<ProfileTagsDTO>();
		
		for (Profile user: profileRepository.findAll()) 
		{
			ProfileTagsDTO pt = createProfileTagsDTO(user);
			list.add(pt);
		}
		
		return CommunitySort.sortProfiles(list, sort.orElse(""));
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
	public List<ProfileTagsDTO> getRecommendedProfiles(String username, Optional<String> sort) throws Exception {
		
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
        List<ProfileTagsDTO> listOfRecommendedProfiles = new ArrayList<>();
        listOfRecommendedProfiles.addAll(recommendations);
		
        return CommunitySort.sortProfiles(listOfRecommendedProfiles, sort.orElse(""));
	}
    
    /**
     * Filter through Profiles to find users with given tag
     * @param tag to filter for
     * @return list of profiles with tag, or empty list if tag does not exist
     */
	@Transactional
	public List<ProfileTagsDTO> filterTags(List<String> programs, List<String> types, Optional<String> sort) {
		Set<ProfileTagsDTO> allProfiles = new HashSet<>();
	
		// Handle null case to avoid NullPointerException
		if (programs == null) programs = new ArrayList<>();
		if (types == null) types = new ArrayList<>();
	
		for (Profile profile : profileRepository.findAll()) {
			// Convert Set<Tag> to Set<String>
			Set<String> tagSet = profile.getTags()
				.stream()
				.map(Tag::getTag)
				.collect(Collectors.toSet());
	
			// OR logic within types and programs, AND logic between them
			boolean hasType = types.isEmpty() || types.stream().anyMatch(tagSet::contains);
			boolean hasProgram = programs.isEmpty() || programs.stream().anyMatch(tagSet::contains);
	
			if (hasType && hasProgram) {
				allProfiles.add(createProfileTagsDTO(profile));
			}
		}
	
		List<ProfileTagsDTO> result = new ArrayList<>(allProfiles);
		return CommunitySort.sortProfiles(result, sort.orElse(""));
	}


    /**
     * Queries profiles to search and find closest match
     * @param query to search/match with
     * @return list of possible matching profiles
     */
    @Transactional
	public List<ProfileTagsDTO> queryProfile(String query, Optional<String> sort) {
		
		List<ProfileTagsDTO> list = new ArrayList<>();
		
		for (Profile p : profileRepository.findProfileBySearch(query)) {
			list.add(createProfileTagsDTO(p));
		}
		
		return CommunitySort.sortProfiles(list, sort.orElse(""));
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
    
}
