package com.yucircle.messagingapp.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.yucircle.messagingapp.model.Message;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
	@Query("SELECT m FROM Message m WHERE (m.sender = :user1 AND m.receiver = :user2) OR (m.sender = :user2 AND m.receiver = :user1) ORDER BY m.timestamp DESC")
    List<Message> findMessagesBetweenUsers(@Param("user1") String user1, @Param("user2") String user2);
	
	List<Message> findBySender(String sender);
	List<Message> findByReceiver(String receiver);
}