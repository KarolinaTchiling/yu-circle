package com.yucircle.discourceapp.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.yucircle.discourceapp.model.Comment;
import com.yucircle.discourceapp.model.CommentLike;
import com.yucircle.discourceapp.repository.CommentLikeRepository;
import com.yucircle.discourceapp.repository.CommentRepository;

@Service
public class CommentLikeService {
    @Autowired
    private CommentLikeRepository commentLikeRepository;

    @Autowired
    private CommentRepository commentRepository;
    
    public List<CommentLike> getLikesForComment(Long commentId) {
        return commentLikeRepository.findByCommentId(commentId);
    }

    public void likeComment(Long commentId, String username) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        if (!commentLikeRepository.existsByCommentAndUsername(comment, username)) {
            CommentLike like = new CommentLike();
            like.setComment(comment);
            like.setUsername(username);
            commentLikeRepository.save(like);
        }
    }

    public void unlikeComment(Long commentId, String username) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        commentLikeRepository.deleteByCommentAndUsername(comment, username);
    }
}