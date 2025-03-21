package com.yucircle.community_service.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.yucircle.community_service.model.Profile;
import com.yucircle.community_service.model.ProfileTag;
import com.yucircle.community_service.model.ProfileTagsDTO;
import com.yucircle.community_service.service.CommunityService;
import com.yucircle.community_service.service.ProfileTaggingService;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("community")
public class CommunityProfileController {
	
	//Autowired auto injects instance of CommunityService
	@Autowired
	private CommunityService commService;
	
	@Autowired
	private ProfileTaggingService ptService;
	
	
	//return list of tags belonging to given profile
	@PostMapping("/get-profile-tags")
	public List<String> getProfileTags(@RequestBody Profile profile) {
		return ptService.getProfileTags(profile.getUsername());
	}
	
	//add tag to profile
	//RequestBody should have a JSON containing profile and the tag to add
	//If tag does not exist, a new one is created
	@PostMapping("/add-profile-tag") 
	public ResponseEntity<HttpStatus> addProfileTag(@RequestBody ProfileTag pt) {
		try {
			ptService.addProfileTag(pt.getProfile().getUsername(), pt.getTag().getTag());
			return ResponseEntity.ok(HttpStatus.OK);
		}
		catch (Exception e) {
			return ResponseEntity.notFound().build();			
		}
	}
	
	//remove tag from profile
	//RequestBody should have a JSON containing both profile and the tag to remove
	@DeleteMapping("/remove-profile-tag")
	public ResponseEntity<HttpStatus> removeProfileTag(@RequestBody ProfileTag pt) {
		try {
			ptService.removeProfileTag(pt.getProfile().getUsername(), pt.getTag().getTag());
			return ResponseEntity.ok(HttpStatus.OK);
		}
		catch (Exception e) {
			return ResponseEntity.notFound().build();			
		}
	}
	
	
	
	
	//Return all profiles (excluding passwords) with their profile tags
	//URL Example: localhost:8080/community/get-default-profiles?sort=asc
	@GetMapping("/get-default-profiles")
	public List<ProfileTagsDTO> getDefaultProfiles(@RequestParam(required = false) Optional<String> sort) {
		return commService.getDefaultProfiles(sort);
	}
	
	//Return recommended profiles with their profile tags,
	//returns empty list if no recommendations can be made
	@GetMapping("/get-recommended-profiles")
	public List<ProfileTagsDTO> getRecommendedProfiles(@RequestBody Profile profile, @RequestParam(required = false) Optional<String> sort) throws Exception {
		return commService.getRecommendedProfiles(profile.getUsername(), sort);
	}
	
	//Filter and return profiles with specified tag
	//URL Example: localhost:8080/community/filter?tag=Chemistry
	@GetMapping("/filter")
	public List<ProfileTagsDTO> filterTags(@RequestParam String tag, @RequestParam(required = false) Optional<String> sort) {
		return commService.filterTags(tag, sort);
	}
	
	//Return potential matches to search query
	//URL Example: localhost:8080/community/search?query=j
	@GetMapping("/search")
	public List<ProfileTagsDTO> searchUser(@RequestParam String query, @RequestParam(required = false) Optional<String> sort) {
		return commService.queryProfile(query, sort);
	}

}
