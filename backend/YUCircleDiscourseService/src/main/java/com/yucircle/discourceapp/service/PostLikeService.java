package com.yucircle.discourceapp.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.yucircle.discourceapp.model.Post;
import com.yucircle.discourceapp.model.PostLike;
import com.yucircle.discourceapp.repository.PostLikeRepository;
import com.yucircle.discourceapp.repository.PostRepository;

@Service
public class PostLikeService {
    @Autowired
    private PostLikeRepository postLikeRepository;

    @Autowired
    private PostRepository postRepository;
    
    public List<PostLike> getLikesForPost(Long postId) {
        return postLikeRepository.findByPostId(postId);
    }

    public void likePost(Long postId, String username) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        if (!postLikeRepository.existsByPostAndUsername(post, username)) {
            PostLike like = new PostLike();
            like.setPost(post);
            like.setUsername(username);
            postLikeRepository.save(like);
        }
    }

    public void unlikePost(Long postId, String username) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        postLikeRepository.deleteByPostAndUsername(post, username);
    }
}