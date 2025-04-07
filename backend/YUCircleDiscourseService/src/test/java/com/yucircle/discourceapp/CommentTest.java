package com.yucircle.discourceapp;

import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import com.yucircle.discourceapp.model.Post;

import java.util.List;

import com.yucircle.discourceapp.*;

import static org.junit.jupiter.api.Assertions.*;
import com.yucircle.discourceapp.model.Comment;

class CommentTest {

    @Test
    void testSetAndGetContent() {
        Comment comment = new Comment();
        comment.setContent("This is a test comment.");
        assertEquals("This is a test comment.", comment.getContent());
    }

    @Test
    void testSetAndGetUsername() {
        Comment comment = new Comment();
        comment.setUsername("testuser");
        assertEquals("testuser", comment.getUsername());
    }

    @Test
    void testSetAndGetTimestamp() {
        Comment comment = new Comment();
        LocalDateTime now = LocalDateTime.now();
        comment.setTimestamp(now);
        assertEquals(now, comment.getTimestamp());
    }

    @Test
    void testSetAndGetPost() {
        Comment comment = new Comment();
        Post post = new Post();
        comment.setPost(post);
        assertEquals(post, comment.getPost());
    }

    @Test
    void testSetAndGetParentComment() {
        Comment parent = new Comment();
        Comment child = new Comment();
        child.setParentComment(parent);
        assertEquals(parent, child.getParentComment());
    }

    @Test
    void testSoftDelete() {
        Comment comment = new Comment();
        comment.setContent("original content");
        comment.setUsername("real_user");

        comment.softDelete();

        assertEquals("Deleted", comment.getContent());
        assertEquals("Deleted", comment.getUsername());

    }

}
