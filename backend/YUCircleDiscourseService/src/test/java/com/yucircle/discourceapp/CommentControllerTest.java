package com.yucircle.discourceapp;

import com.yucircle.discourceapp.model.Comment;
import com.yucircle.discourceapp.model.CommentLike;
import com.yucircle.discourceapp.service.CommentService;
import com.yucircle.discourceapp.service.NotificationProducerService;
import com.yucircle.discourceapp.controller.CommentController;

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

@WebMvcTest(CommentController.class)
@ExtendWith(MockitoExtension.class)
@ActiveProfiles("test")
class CommentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private CommentService commentService;

    @MockBean
    private NotificationProducerService notificationProducerService;

    private Comment comment;
    private CommentLike commentLike;

    @BeforeEach
    void setup() {
        comment = new Comment();
        commentLike = new CommentLike();
    }

    @Test
    void getComment_Found() throws Exception {
        // Tests retrieving a specific comment that exists
        given(commentService.getCommentsById(1L)).willReturn(Optional.of(comment));

        mockMvc.perform(get("/comments/{commentId}", 1L))
                .andExpect(status().isOk());

        then(commentService).should(times(1)).getCommentsById(1L);
    }

    @Test
    void getComment_NotFound() throws Exception {
        // Tests retrieving a comment that does not exist
        given(commentService.getCommentsById(999L)).willReturn(Optional.empty());

        mockMvc.perform(get("/comments/{commentId}", 999L))
                .andExpect(status().isNotFound());

        then(commentService).should(times(1)).getCommentsById(999L);
    }

    @Test
    void getPostIdForComment_Found() throws Exception {
        // Tests getting the post ID associated with a comment
        comment.setPost(new com.yucircle.discourceapp.model.Post());
        comment.getPost().setId(100L);

        given(commentService.getCommentsById(1L)).willReturn(Optional.of(comment));

        mockMvc.perform(get("/comments/{commentId}/post", 1L))
                .andExpect(status().isOk())
                .andExpect(content().string("100"));

        then(commentService).should(times(1)).getCommentsById(1L);
    }

    @Test
    void getPostIdForComment_NotFound() throws Exception {
        // Tests getting post ID for a non-existent comment
        given(commentService.getCommentsById(2L)).willReturn(Optional.empty());

        mockMvc.perform(get("/comments/{commentId}/post", 2L))
                .andExpect(status().isNotFound());

        then(commentService).should(times(1)).getCommentsById(2L);
    }

    @Test
    void getCommentsByUser() throws Exception {
        // Tests retrieving all comments made by a specific user
        List<Comment> comments = new ArrayList<>();
        comments.add(comment);

        given(commentService.getCommentsByUsername("c")).willReturn(comments);

        mockMvc.perform(get("/comments/user/{username}", "megan"))
                .andExpect(status().isOk());

        then(commentService).should(times(1)).getCommentsByUsername("megan");
    }

    @Test
    void getPostComments() throws Exception {
        // Tests retrieving all top-level comments for a given post
        List<Comment> comments = Collections.singletonList(comment);
        given(commentService.getTopLevelCommentsForPost(200L)).willReturn(comments);

        mockMvc.perform(get("/comments/posts/{postId}", 200L))
                .andExpect(status().isOk());

        then(commentService).should(times(1)).getTopLevelCommentsForPost(200L);
    }

    @Test
    void addComment() throws Exception {
        // Tests creating a new comment and triggering a notification
        String json = """
                {
                  "postId": 100,
                  "username": "megan",
                  "content": "New comment"
                }
                """;

        given(commentService.addComment(any(Map.class))).willReturn(comment);

        mockMvc.perform(post("/comments")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isOk());

        then(commentService).should(times(1)).addComment(any(Map.class));
        then(notificationProducerService).should(times(1))
                .createCommentNotification(any(Comment.class));
    }

    @Test
    void deleteComment() throws Exception {
        // Tests deleting a comment by its ID
        willDoNothing().given(commentService).deleteComment(1L);

        mockMvc.perform(delete("/comments/delete/{id}", 1L))
                .andExpect(status().isNoContent());

        then(commentService).should(times(1)).deleteComment(1L);
    }

    @Test
    void updateComment() throws Exception {
        // Tests updating an existing comment's content
        String json = """
                {
                  "content": "Updated comment"
                }
                """;

        Comment updatedEntity = new Comment();
        updatedEntity.setContent("Updated comment");

        given(commentService.updateComment(eq(1L), any(Map.class))).willReturn(updatedEntity);

        mockMvc.perform(put("/comments/update/{id}", 1L)
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").value("Updated comment"));

        then(commentService).should(times(1)).updateComment(eq(1L), any(Map.class));
    }

    @Test
    void likeComment() throws Exception {
        // Tests liking a comment and triggering a notification
        String json = """
                {
                  "commentId": 1,
                  "username": "megan"
                }
                """;

        given(commentService.likeComment(any(Map.class))).willReturn(commentLike);

        mockMvc.perform(post("/comments/like")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isOk());

        then(commentService).should(times(1)).likeComment(any(Map.class));
        then(notificationProducerService).should(times(1))
                .createLikeCommentNotification(any(CommentLike.class));
    }

    @Test
    void unlikeComment() throws Exception {
        // Tests unliking a previously liked comment
        String json = """
                {
                  "commentId": 1,
                  "username": "megan"
                }
                """;

        willDoNothing().given(commentService).unlikeComment(any(Map.class));

        mockMvc.perform(delete("/comments/unlike")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isNoContent());

        then(commentService).should(times(1)).unlikeComment(any(Map.class));
    }

    @Test
    void getAllLikesByPostId() throws Exception {
        // Tests retrieving all likes for a given comment ID
        List<CommentLike> likes = new ArrayList<>();
        likes.add(commentLike);

        given(commentService.getAllLikesByPostId(1L)).willReturn(likes);

        mockMvc.perform(get("/comments/like/commentid/{commentId}", 1L))
                .andExpect(status().isOk());

        then(commentService).should(times(1)).getAllLikesByPostId(1L);
    }

    @Test
    void getAllLikesByUsername() throws Exception {
        // Tests retrieving all likes made by a specific user
        List<CommentLike> likes = new ArrayList<>();
        likes.add(commentLike);

        given(commentService.getAllLikesByUsername("megan")).willReturn(likes);

        mockMvc.perform(get("/comments/like/username/{username}", "megan"))
                .andExpect(status().isOk());

        then(commentService).should(times(1)).getAllLikesByUsername("megan");
    }
}
