package com.yucircle.discourceapp;

import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import com.yucircle.discourceapp.model.CommentLike;

import static org.junit.jupiter.api.Assertions.*;

class CommentLikeTest {

    @Test
    void testSetAndGetUsername() {
        CommentLike like = new CommentLike();
        like.setUsername("john_doe");
        assertEquals("john_doe", like.getUsername());
    }

    @Test
    void testSetAndGetCommentId() {
        CommentLike like = new CommentLike();
        like.setCommentId(100L);
        assertEquals(100L, like.getCommentId());
    }

    @Test
    void testSetAndGetTimestamp() {
        CommentLike like = new CommentLike();
        LocalDateTime now = LocalDateTime.now();
        like.setTimestamp(now);
        assertEquals(now, like.getTimestamp());
    }

    @Test
    void testDefaultValuesAreNull() {
        CommentLike like = new CommentLike();
        assertNull(like.getUsername());
        assertNull(like.getCommentId());
        assertNull(like.getTimestamp());
    }
}
