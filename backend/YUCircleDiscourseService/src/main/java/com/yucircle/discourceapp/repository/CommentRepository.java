package com.yucircle.discourceapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

import com.yucircle.discourceapp.model.Comment;
import com.yucircle.discourceapp.model.Post;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByPostId(Long postId);

//	List<Comment> findByCommentId(Long commentId);
	
	Optional<Comment> findByCommentId(Long commentId);

	List<Comment> findByParentComment(Comment parent);

	Optional<Comment> findById(Long id);

	List<Comment> findByParentCommentIsNull();

	List<Comment> findByPostAndParentCommentIsNull(Post post);
}