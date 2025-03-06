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

import com.yucircle.discourceapp.model.PostLike;
import com.yucircle.discourceapp.service.PostLikeService;

@RestController
@RequestMapping("/posts")
public class PostLikeController {

    @Autowired
    private PostLikeService postLikeService;
    
//    @GetMapping("/getlikes/{postId}")
//    public ResponseEntity<List<PostLike>> getPostLikes(@PathVariable Long postId) {
//        return ResponseEntity.ok(postLikeService.getLikesForPost(postId));
//    }

    @PostMapping("/{postId}/like")
    public ResponseEntity<?> likePost(@PathVariable Long postId, @RequestParam String username) {
        postLikeService.likePost(postId, username);
        return ResponseEntity.ok("Post liked");
    }

    @DeleteMapping("/{postId}/unlike")
    public ResponseEntity<?> unlikePost(@PathVariable Long postId, @RequestParam String username) {
        postLikeService.unlikePost(postId, username);
        return ResponseEntity.ok("Post unliked");
    }
}