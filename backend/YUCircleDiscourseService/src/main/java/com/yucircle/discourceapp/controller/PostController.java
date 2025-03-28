package com.yucircle.discourceapp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import com.yucircle.discourceapp.model.Post;
import com.yucircle.discourceapp.model.PostLike;
import com.yucircle.discourceapp.service.NotificationProducerService;
import com.yucircle.discourceapp.service.PostService;

@RestController
@RequestMapping("/posts")
public class PostController {
    @Autowired
    private PostService postService;
    
    @Autowired
    private NotificationProducerService nService;

    @GetMapping
    public List<Post> getAllPosts() {
        return postService.getAllPosts();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Post> getPostById(@PathVariable Long id) {
        return postService.getPostById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Post> createPost(@RequestBody Map<String, Object> post) {
        Post newPost = postService.createPost(post);
        return ResponseEntity.ok(newPost);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable Long id) {
        postService.deletePost(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Post> updatePost(@PathVariable Long id, @RequestBody Map<String, Object> updatedPost) {
        Post post = postService.updatePost(id, updatedPost);
        return ResponseEntity.ok(post);
    }
    
    @PostMapping("/like")
    public ResponseEntity<PostLike> likePost(@RequestBody Map<String, Object> like) {
        PostLike newPostLike = postService.likePost(like);
        nService.createLikePostNotification(newPostLike);
        return ResponseEntity.ok(newPostLike);
    }
    
    @DeleteMapping("/unlike")
    public ResponseEntity<Void> unlikePost(@RequestBody Map<String, Object> like) {
        postService.unlikePost(like);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/like/postid/{postId}")
    public List<PostLike> getAllLikesByPostId(@PathVariable Long postId) {
        return postService.getAllLikesByPostId(postId);
    }
    
    @GetMapping("/like/username/{username}")
    public List<PostLike> getAllLikesByUsername(@PathVariable String username) {
        return postService.getAllLikesByUsername(username);
    }
}