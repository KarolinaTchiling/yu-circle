package com.yucircle.community_service.model;

import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

public class ProfileTagsDTO {
	
	private String username;
    private String yorkId;
    private String firstname;
    private String lastname;
    private String email;
    private String phoneNumber;
    private Boolean isAdmin = false;
    
    private java.sql.Timestamp createdAt;
    
    private Set<String> tags = new HashSet<String>();
    
    
    public ProfileTagsDTO() {}
	
	public ProfileTagsDTO(Profile profile) {
		this.username = profile.getUsername();
		this.yorkId = profile.getYorkId();
		this.firstname = profile.getFirstname();
		this.lastname = profile.getLastname();
		this.email = profile.getEmail();
		this.phoneNumber = profile.getPhoneNumber();
		this.isAdmin = profile.getIsAdmin();
		this.createdAt = profile.getCreatedAt();
		setTags(profile.getTags());
	}
    
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
    
    public String getYorkId() {
		return yorkId;
	}

	public void setYorkId(String yorkId) {
		this.yorkId = yorkId;
	}

	public String getFirstname() {
		return firstname;
	}

	public void setFirstname(String firstname) {
		this.firstname = firstname;
	}

	public String getLastname() {
		return lastname;
	}

	public void setLastname(String lastname) {
		this.lastname = lastname;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPhoneNumber() {
		return phoneNumber;
	}

	public void setPhoneNumber(String phoneNumber) {
		this.phoneNumber = phoneNumber;
	}

	public Boolean getIsAdmin() {
		return isAdmin;
	}

	public void setIsAdmin(Boolean isAdmin) {
		this.isAdmin = isAdmin;
	}

	public java.sql.Timestamp getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(java.sql.Timestamp createdAt) {
		this.createdAt = createdAt;
	}

	public Set<String> getTags() {
        return tags;
    }

    public void setTagsString(Set<String> tags) {
        this.tags = tags;
    }
    
    public void setTags(Set<Tag> tags) {
    	for (Tag t : tags) 
    	{
    		this.tags.add(t.getTag());
    	}
    }

	@Override
	public int hashCode() {
		return Objects.hash(username);
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		ProfileTagsDTO other = (ProfileTagsDTO) obj;
		return Objects.equals(username, other.username);
	}    
}
