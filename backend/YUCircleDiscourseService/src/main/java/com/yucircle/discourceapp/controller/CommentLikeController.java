package com.yucircle.discourceapp.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.yucircle.discourceapp.model.CommentLike;
import com.yucircle.discourceapp.service.CommentLikeService;

@RestController
@RequestMapping("/comments")
public class CommentLikeController {

    @Autowired
    private CommentLikeService commentLikeService;
    
//    @GetMapping("/commentlike/{commentId}")
//    public ResponseEntity<List<CommentLike>> getCommentLikes(@PathVariable Long commentId) {
//        return ResponseEntity.ok(commentLikeService.getLikesForComment(commentId));
//    }

    @PostMapping("/{commentId}/like")
    public ResponseEntity<?> likeComment(@PathVariable Long commentId, @RequestParam String username) {
        commentLikeService.likeComment(commentId, username);
        return ResponseEntity.ok("Comment liked");
    }

    @DeleteMapping("/{commentId}/unlike")
    public ResponseEntity<?> unlikeComment(@PathVariable Long commentId, @RequestParam String username) {
        commentLikeService.unlikeComment(commentId, username);
        return ResponseEntity.ok("Comment unliked");
    }
}