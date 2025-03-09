package com.yucircle.community_service.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.yucircle.community_service.model.Profile;
import com.yucircle.community_service.model.ProfileTag;
import com.yucircle.community_service.model.Tag;

public interface ProfileTagRepository extends JpaRepository<ProfileTag, Long> {
	void deleteByProfileAndTag(Profile profile, Tag tag);
}