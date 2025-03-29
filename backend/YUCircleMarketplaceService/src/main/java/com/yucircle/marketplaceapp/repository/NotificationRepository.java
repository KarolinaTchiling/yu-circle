package com.yucircle.marketplaceapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.yucircle.marketplaceapp.model.Notification;

public interface NotificationRepository extends JpaRepository<Notification, Long> {}
