package com.yucircle.community_service.service;

import java.util.Comparator;
import java.util.List;

import com.yucircle.community_service.model.ProfileTagsDTO;

public class CommunitySort {
	
	public static List<ProfileTagsDTO> sortProfiles(List<ProfileTagsDTO> profiles, String sortField) {
        
		Comparator<ProfileTagsDTO> comparator;

        switch (sortField) {
        	// sort alphabetically
            case "asc":
                comparator = Comparator.comparing(ProfileTagsDTO::getFirstname);
                break;
            // sort reverse alphabetically
            case "desc":
                comparator = Comparator.comparing(ProfileTagsDTO::getFirstname).reversed();
                break;
            default:
                return profiles;
        }

        return profiles.stream().sorted(comparator).toList();
    }
	
}
