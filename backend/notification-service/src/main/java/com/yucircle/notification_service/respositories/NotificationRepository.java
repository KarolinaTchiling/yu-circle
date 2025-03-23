package com.yucircle.notification_service.respositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.yucircle.notification_service.model.Notification;

public interface NotificationRepository extends JpaRepository<Notification, String> {
	List<Notification> findByUsername(String username);
}
