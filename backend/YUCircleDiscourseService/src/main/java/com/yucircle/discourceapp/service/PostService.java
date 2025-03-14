package com.yucircle.discourceapp.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import com.yucircle.discourceapp.exception.NotFoundException;
import com.yucircle.discourceapp.model.*;
import com.yucircle.discourceapp.repository.*;

@Service
public class PostService {
    @Autowired
    private PostRepository postRepository;

    @Autowired
    private CommentRepository commentRepository;

    public List<Post> getAllPosts() {
        // return postRepository.findAll();
        List<Post> posts = postRepository.findAll();
        for (Post post : posts) {
            List<Comment> comments = new ArrayList<>();
            comments.addAll(post.getComments());
            for (Comment comment : post.getComments()) {
                if (comment.getParentComment() != null) {
                    comments.remove(comment);
                }
            }
            post.setComments(comments);
        }
        return posts;
    }

    public Optional<Post> getPostById(Long id) {
        // return postRepository.findById(id);
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        List<Comment> topLevelComments = post.getComments().stream()
                .filter(comment -> comment.getParentComment() == null)
                .toList();

        post.setComments(topLevelComments);

        // List<Comment> comments = commentRepository.findByPostId(id);
        // post.setComments(comments);
        return Optional.ofNullable(post);
    }

    public Post createPost(Map<String, Object> newPost) {
        Post post = new Post();
        post.setTitle((String) newPost.get("title"));
        post.setUsername((String) newPost.get("username"));
        post.setContent((String) newPost.get("content"));

        return postRepository.save(post);
    }

    public void deletePost(Long id) {
        postRepository.findById(id).ifPresent(post -> {
            post.softDelete();
            postRepository.save(post);
        });
    }

    public Post updatePost(Long id, Map<String, Object> updatedPost) {
        Post existingPost = postRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Post not found"));

        if (updatedPost.containsKey("title")) {
            existingPost.setTitle((String) updatedPost.get("title"));
        }
        if (updatedPost.containsKey("content")) {
            existingPost.setContent((String) updatedPost.get("content"));
        }
        return postRepository.save(existingPost);
    }

}