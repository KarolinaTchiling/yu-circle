package com.yucircle.discourceapp.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import com.yucircle.discourceapp.exception.NotFoundException;
import com.yucircle.discourceapp.model.*;
import com.yucircle.discourceapp.repository.*;

@Service
public class CommentService {
    @Autowired
    private CommentRepository commentRepository;
    @Autowired
    private PostRepository postRepository;

    public List<Comment> getCommentsByPost(Long postId) {
        return commentRepository.findByPostId(postId);
    }
    
    public Optional<Comment> getCommentsById(Long commentId) {
        return commentRepository.findByCommentId(commentId);
    }
    
    public List<Comment> getTopLevelCommentsForPost(Long postId) {
        Post post = new Post();
        post.setId(postId);
        return commentRepository.findByPostAndParentCommentIsNull(post);
    }
    
    
//    public List<Comment> getCommentsById(Long commentId) {
//        return commentRepository.findByCommentId(commentId);
//    }
    	
//    public Comment getCommentWithParent(Long id) {
//        Comment comment = commentRepository.findById(id)
//                .orElseThrow(() -> new RuntimeException("Comment not found"));
//
//        // Ensure the parentComment is initialized
//        if (comment.getParentComment() != null) {
//            comment.getParentComment().getCommentId(); // Access the parentComment to initialize it
//        }
//
//        return comment;
//    }

    public Comment addComment(Map<String, Object> request) {
        Comment newComment = new Comment();
        newComment.setContent((String) request.get("content"));
        newComment.setUsername((String) request.get("username"));

        Long postId = ((Number) request.get("postId")).longValue();
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        newComment.setPost(post);

        if (request.containsKey("parentId") && request.get("parentId") != null) {
            Long parentId = ((Number) request.get("parentId")).longValue();
            Comment parent = commentRepository.findById(parentId)
                    .orElseThrow(() -> new RuntimeException("Parent comment not found"));
            newComment.setParentComment(parent);
        }

        return commentRepository.save(newComment);
    }


    public void deleteComment(Long id) {
        commentRepository.findById(id).ifPresent(comment -> {
            comment.softDelete();
            commentRepository.save(comment);
        });
    }
    
    public Comment updateComment(Long commentId, Map<String, Object> request) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Parent comment not found"));
        comment.setContent((String) request.get("content"));

        return commentRepository.save(comment);
    }
}