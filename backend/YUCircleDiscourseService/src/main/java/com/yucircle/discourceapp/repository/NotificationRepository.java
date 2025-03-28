package com.yucircle.discourceapp.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.yucircle.discourceapp.model.Notification;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
	List<Notification> findByUsername(String username);
}
