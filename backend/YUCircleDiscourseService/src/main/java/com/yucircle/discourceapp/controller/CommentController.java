package com.yucircle.discourceapp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import com.yucircle.discourceapp.model.Comment;
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

    @GetMapping("/posts/{postId}")
    public List<Comment> getPostComments(@PathVariable Long postId) {
        return commentService.getTopLevelCommentsForPost(postId);
    }

    @PostMapping
    public ResponseEntity<Comment> addComment(@RequestBody Map<String, Object> request) {
        Comment savedComment = commentService.addComment(request);
        nService.createNotification("bob");
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
}

// @GetMapping("/{id}")
// public ResponseEntity<Comment> getCommentWithParent(@PathVariable Long id) {
// try {
// Comment comment = commentService.getCommentWithParent(id);
// return ResponseEntity.ok(comment);
// } catch (RuntimeException ex) {
// return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
// }
// }

// @PostMapping
// public ResponseEntity<Comment> addComment(@RequestBody Comment comment) {
// // Check if Post is null before saving the comment
//// if (comment.getPost() == null) {
//// throw new IllegalArgumentException("Post must be provided");
//// }
// return ResponseEntity.ok(commentService.addComment(comment));
// }

//// Add a new comment (or reply to an existing comment)
// @PostMapping("/{postId}")
// public ResponseEntity<Comment> addComment(@PathVariable Long postId,
// @RequestBody Comment commentRequest) {
// // Add the comment using the service
// Comment newComment = commentService.addComment(postId,
//// commentRequest.getParentId(),
// commentRequest.getUsername(), commentRequest.getContent());
// return ResponseEntity.status(HttpStatus.CREATED).body(newComment);
// }