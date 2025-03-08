package com.yucircle.profileapp.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;

// Entity indicates this class will be mapped to a table in the database.
@Entity
@Table(name = "profiles")
public class Profile {
    
	// Id indicates this as the primary key.
    @Id
    private String username;

    // Column indicates that this is a field mapped to a column
    // Names are the same as the ones in the column, you can have different names 
    // by adding another parameter in the brackets for name="otherName" to refer to the column
    @Column(nullable = false)
    @JsonIgnore
    private String password;

    @Column(unique = true)
    private String yorkId;

    @Column(nullable = false)
    private String firstname;

    @Column(nullable = false)
    private String lastname;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(unique = false)
    private String phoneNumber;

    @JsonIgnore
    private Boolean isAdmin = false;

    @Column(columnDefinition = "TEXT")
    private String bio;

    
    // Getter methods
    //

    public String getUsername() {
        return username;
    }

    public String getPassword() {
        return password;
    }

    public String getYorkId() {
        return yorkId;
    }

    public String getFirstname() {
        return firstname;
    }

    public String getLastname() {
        return lastname;
    }

    public String getEmail() {
        return email;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public Boolean getIsAdmin() {
        return isAdmin;
    }

    
    public String getUserBio() {
    	return this.bio;
    }

    
    // Setter methods
    //

    public void setUsername(String username) {
        this.username = username;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setYorkId(String yorkId) {
        this.yorkId = yorkId;
    }

    public void setFirstname(String firstname) {
        this.firstname = firstname;
    }

    public void setLastname(String lastname) {
        this.lastname = lastname;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public void setIsAdmin(Boolean isAdmin) {
        this.isAdmin = isAdmin;
    }


	public void setBio(String bio) {
		// TODO Auto-generated method stub
		this.bio = bio;
	}
}