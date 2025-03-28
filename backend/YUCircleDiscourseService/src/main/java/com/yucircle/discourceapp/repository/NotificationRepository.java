package com.yucircle.discourceapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.yucircle.discourceapp.model.Notification;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
}
