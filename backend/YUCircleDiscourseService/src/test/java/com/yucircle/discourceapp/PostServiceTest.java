package com.yucircle.discourceapp;

import com.yucircle.discourceapp.exception.NotFoundException;
import com.yucircle.discourceapp.model.*;
import com.yucircle.discourceapp.repository.PostLikeRepository;
import com.yucircle.discourceapp.repository.PostRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import java.time.LocalDateTime;
import com.yucircle.discourceapp.service.PostService;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class PostServiceTest {

    @InjectMocks
    private PostService postService;

    @Mock
    private PostRepository postRepository;

    @Mock
    private PostLikeRepository postLikeRepository;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetAllPosts_filtersNestedReplies() {
        Post post = new Post();
        Comment c1 = new Comment();
        c1.setContent("Top level comment");

        Comment reply = new Comment();
        reply.setContent("Reply");
        reply.setParentComment(c1);

        post.setComments(List.of(c1, reply));

        when(postRepository.findAll()).thenReturn(List.of(post));

        List<Post> result = postService.getAllPosts();

        assertEquals(1, result.get(0).getComments().size());
        assertEquals("Top level comment", result.get(0).getComments().get(0).getContent());
    }

    @Test
    void testGetPostById_filtersTopLevelCommentsOnly() {
        Post post = new Post();
        post.setId(1L);

        Comment topComment = new Comment();
        topComment.setContent("Top");
        Comment reply = new Comment();
        reply.setParentComment(topComment);
        post.setComments(List.of(topComment, reply));

        when(postRepository.findById(1L)).thenReturn(Optional.of(post));

        Optional<Post> result = postService.getPostById(1L);

        assertTrue(result.isPresent());
        assertEquals(1, result.get().getComments().size());
        assertNull(result.get().getComments().get(0).getParentComment());
    }

    @Test
    void testGetPostById_notFound() {
        when(postRepository.findById(100L)).thenReturn(Optional.empty());
        assertThrows(RuntimeException.class, () -> postService.getPostById(100L));
    }

    @Test
    void testCreatePost_savesNewPost() {
        Map<String, Object> data = new HashMap<>();
        data.put("title", "Hello");
        data.put("content", "World");
        data.put("username", "mehregan");

        Post post = new Post();
        post.setId(1L);
        when(postRepository.save(any(Post.class))).thenReturn(post);

        Post result = postService.createPost(data);

        assertEquals(1L, result.getId());
        verify(postRepository).save(any(Post.class));
    }

    @Test
    void testUpdatePost_updatesExistingPost() {
        Post existing = new Post();
        existing.setId(1L);
        existing.setTitle("Old");
        existing.setContent("Old content");

        Map<String, Object> update = new HashMap<>();
        update.put("title", "New");
        update.put("content", "Updated");

        when(postRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(postRepository.save(any(Post.class))).thenReturn(existing);

        Post updated = postService.updatePost(1L, update);

        assertEquals("New", updated.getTitle());
        assertEquals("Updated", updated.getContent());
    }

    @Test
    void testUpdatePost_notFound_throwsException() {
        when(postRepository.findById(404L)).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class, () -> postService.updatePost(404L, Map.of("title", "Updated")));
    }

    @Test
    void testLikePost_savesLike() {
        Map<String, Object> like = new HashMap<>();
        like.put("username", "mehregan");
        like.put("postId", 1);

        PostLike saved = new PostLike();
        saved.setUsername("mehregan");
        saved.setPostId(1L);

        when(postLikeRepository.save(any(PostLike.class))).thenReturn(saved);

        PostLike result = postService.likePost(like);

        assertEquals("mehregan", result.getUsername());
        assertEquals(1L, result.getPostId());
    }

    @Test
    void testUnlikePost_callsDeleteByPostIdAndUsername() {
        Map<String, Object> unlike = new HashMap<>();
        unlike.put("username", "mehregan");
        unlike.put("postId", 1);

        postService.unlikePost(unlike);

        verify(postLikeRepository).deleteByPostIdAndUsername(1L, "mehregan");
    }

    @Test
    void testGetAllLikesByPostId_returnsLikes() {
        List<PostLike> likes = List.of(new PostLike(), new PostLike());
        when(postLikeRepository.findAllByPostId(1L)).thenReturn(likes);

        List<PostLike> result = postService.getAllLikesByPostId(1L);
        assertEquals(2, result.size());
    }

    @Test
    void testGetAllLikesByUsername_returnsLikes() {
        List<PostLike> likes = List.of(new PostLike());
        when(postLikeRepository.findAllByUsername("mehregan")).thenReturn(likes);

        List<PostLike> result = postService.getAllLikesByUsername("mehregan");
        assertEquals(1, result.size());
    }
}
