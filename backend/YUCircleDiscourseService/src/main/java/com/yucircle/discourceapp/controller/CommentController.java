package com.yucircle.discourceapp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import com.yucircle.discourceapp.model.Comment;
import com.yucircle.discourceapp.model.CommentLike;
import com.yucircle.discourceapp.model.PostLike;
import com.yucircle.discourceapp.service.CommentService;
import com.yucircle.discourceapp.service.NotificationProducerService;
import com.yucircle.discourceapp.service.PostService;

@RestController
@RequestMapping("/comments")
public class CommentController {
    @Autowired
    private CommentService commentService;
    
    @Autowired
    private NotificationProducerService nService;

    @GetMapping("/{commentId}")
    public ResponseEntity<Comment> getComment(@PathVariable Long commentId) {
        Optional<Comment> comment = commentService.getCommentsById(commentId);
        return comment
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{username}")
    public ResponseEntity<List<Comment>> getCommentsByUser(@PathVariable String username) {
        List<Comment> comments = commentService.getCommentsByUsername(username);
        return ResponseEntity.ok(comments);
    }

    @GetMapping("/posts/{postId}")
    public List<Comment> getPostComments(@PathVariable Long postId) {
        return commentService.getTopLevelCommentsForPost(postId);
    }

    @PostMapping
    public ResponseEntity<Comment> addComment(@RequestBody Map<String, Object> request) {
        Comment savedComment = commentService.addComment(request);
        nService.createCommentNotification(savedComment);
        return ResponseEntity.ok(savedComment);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long id) {
        commentService.deleteComment(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Comment> updateComment(@PathVariable Long id,
            @RequestBody Map<String, Object> updatedComment) {
        Comment comment = commentService.updateComment(id, updatedComment);
        return ResponseEntity.ok(comment);
    }
    
    @PostMapping("/like")
    public ResponseEntity<CommentLike> likeComment(@RequestBody Map<String, Object> like) {
        CommentLike newCommentLike = commentService.likeComment(like);
        return ResponseEntity.ok(newCommentLike);
    }
    
    @DeleteMapping("/unlike")
    public ResponseEntity<Void> unlikePost(@RequestBody Map<String, Object> like) {
    	commentService.unlikeComment(like);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/like/commentid/{commentId}")
    public List<CommentLike> getAllLikesByPostId(@PathVariable Long commentId) {
        return commentService.getAllLikesByPostId(commentId);
    }
    
    @GetMapping("/like/username/{username}")
    public List<CommentLike> getAllLikesByUsername(@PathVariable String username) {
        return commentService.getAllLikesByUsername(username);
    }
}