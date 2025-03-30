package com.yucircle.discourceapp;

import com.yucircle.discourceapp.controller.PostController;
import com.yucircle.discourceapp.model.Post;
import com.yucircle.discourceapp.model.PostLike;
import com.yucircle.discourceapp.service.NotificationProducerService;
import com.yucircle.discourceapp.service.PostService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.*;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(PostController.class)
@ExtendWith(MockitoExtension.class)
@ActiveProfiles("test")
class PostControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private PostService postService;

    @MockBean
    private NotificationProducerService notificationProducerService;

    private Post post;
    private PostLike postLike;

    @BeforeEach
    void setup() {
        post = new Post();
        post.setTitle("Test Title");
        post.setContent("Test Content");
        post.setUsername("megan");

        postLike = new PostLike();
    }

    @Test
    void getAllPosts() throws Exception {
        // Tests retrieving all posts
        List<Post> posts = Collections.singletonList(post);
        given(postService.getAllPosts()).willReturn(posts);

        mockMvc.perform(get("/posts"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("Test Title"));

        then(postService).should(times(1)).getAllPosts();
    }

    @Test
    void getPostById_Found() throws Exception {
        // Tests retrieving a post by its ID when it exists
        given(postService.getPostById(1L)).willReturn(Optional.of(post));

        mockMvc.perform(get("/posts/{id}", 1L))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Test Title"));

        then(postService).should(times(1)).getPostById(1L);
    }

    @Test
    void getPostById_NotFound() throws Exception {
        // Tests retrieving a post by its ID when it does not exist
        given(postService.getPostById(999L)).willReturn(Optional.empty());

        mockMvc.perform(get("/posts/{id}", 999L))
                .andExpect(status().isNotFound());

        then(postService).should(times(1)).getPostById(999L);
    }

    @Test
    void getPostsByUsername() throws Exception {
        // Tests retrieving all posts made by a specific user
        List<Post> posts = Collections.singletonList(post);
        given(postService.getPostsByUsername("megan")).willReturn(posts);

        mockMvc.perform(get("/posts/user/{username}", "megan"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("Test Title"));

        then(postService).should(times(1)).getPostsByUsername("megan");
    }

    @Test
    void createPost() throws Exception {
        // Tests creating a new post
        String json = """
                {
                  "title": "Created Title",
                  "content": "Created Content",
                  "username": "megan"
                }
                """;

        Post newPost = new Post();
        newPost.setTitle("Created Title");
        newPost.setContent("Created Content");
        newPost.setUsername("megan");

        given(postService.createPost(any(Map.class))).willReturn(newPost);

        mockMvc.perform(post("/posts")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Created Title"));

        then(postService).should(times(1)).createPost(any(Map.class));
    }

    @Test
    void deletePost() throws Exception {
        // Tests deleting a post by ID
        willDoNothing().given(postService).deletePost(1L);

        mockMvc.perform(delete("/posts/delete/{id}", 1L))
                .andExpect(status().isNoContent());

        then(postService).should(times(1)).deletePost(1L);
    }

    @Test
    void updatePost() throws Exception {
        // Tests updating an existing post
        String json = """
                {
                  "title": "Updated Title",
                  "content": "Updated Content"
                }
                """;

        Post returnedPost = new Post();
        returnedPost.setTitle("Updated Title");
        returnedPost.setContent("Updated Content");
        returnedPost.setUsername("megan");

        given(postService.updatePost(eq(1L), any(Map.class))).willReturn(returnedPost);

        mockMvc.perform(put("/posts/update/{id}", 1L)
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Updated Title"))
                .andExpect(jsonPath("$.content").value("Updated Content"));

        then(postService).should(times(1)).updatePost(eq(1L), any(Map.class));
    }

    @Test
    void likePost() throws Exception {
        // Tests liking a post and triggering a notification
        String json = """
                {
                  "postId": 1,
                  "username": "megan"
                }
                """;

        given(postService.likePost(any(Map.class))).willReturn(postLike);

        mockMvc.perform(post("/posts/like")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isOk());

        then(postService).should(times(1)).likePost(any(Map.class));
        then(notificationProducerService).should(times(1))
                .createLikePostNotification(any(PostLike.class));
    }

    @Test
    void unlikePost() throws Exception {
        // Tests unliking a post
        String json = """
                {
                  "postId": 1,
                  "username": "megan"
                }
                """;

        willDoNothing().given(postService).unlikePost(any(Map.class));

        mockMvc.perform(delete("/posts/unlike")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isNoContent());

        then(postService).should(times(1)).unlikePost(any(Map.class));
    }

    @Test
    void getAllLikesByPostId() throws Exception {
        // Tests retrieving all likes on a post by its ID
        List<PostLike> likes = new ArrayList<>();
        likes.add(postLike);

        given(postService.getAllLikesByPostId(1L)).willReturn(likes);

        mockMvc.perform(get("/posts/like/postid/{postId}", 1L))
                .andExpect(status().isOk());

        then(postService).should(times(1)).getAllLikesByPostId(1L);
    }

    @Test
    void getAllLikesByUsername() throws Exception {
        // Tests retrieving all likes made by a specific user
        List<PostLike> likes = new ArrayList<>();
        likes.add(postLike);

        given(postService.getAllLikesByUsername("megan")).willReturn(likes);

        mockMvc.perform(get("/posts/like/username/{username}", "megan"))
                .andExpect(status().isOk());

        then(postService).should(times(1)).getAllLikesByUsername("megan");
    }
}
