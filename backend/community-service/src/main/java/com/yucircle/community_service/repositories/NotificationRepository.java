package com.yucircle.community_service.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.yucircle.community_service.model.Notification;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
}
