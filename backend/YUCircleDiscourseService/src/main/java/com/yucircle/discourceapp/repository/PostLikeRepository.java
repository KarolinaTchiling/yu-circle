package com.yucircle.discourceapp.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.yucircle.discourceapp.model.Post;
import com.yucircle.discourceapp.model.PostLike;

@Repository
public interface PostLikeRepository extends JpaRepository<PostLike, Long> {
    boolean existsByPostAndUsername(Post post, String username);
    void deleteByPostAndUsername(Post post, String username);
    List<PostLike> findByPostId(Long postId);
}