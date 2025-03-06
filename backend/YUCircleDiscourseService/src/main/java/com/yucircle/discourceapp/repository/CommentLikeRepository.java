package com.yucircle.discourceapp.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.yucircle.discourceapp.model.Comment;
import com.yucircle.discourceapp.model.CommentLike;

@Repository
public interface CommentLikeRepository extends JpaRepository<CommentLike, Long> {
    boolean existsByCommentAndUsername(Comment comment, String username);
    void deleteByCommentAndUsername(Comment comment, String username);
    List<CommentLike> findByCommentId(Long commentId);
}