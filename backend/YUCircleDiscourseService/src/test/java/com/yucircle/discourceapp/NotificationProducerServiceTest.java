package com.yucircle.discourceapp;

import com.yucircle.discourceapp.model.*;
import com.yucircle.discourceapp.repository.CommentRepository;
import com.yucircle.discourceapp.repository.NotificationRepository;
import com.yucircle.discourceapp.repository.PostRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import com.yucircle.discourceapp.service.NotificationProducerService;
import org.mockito.*;

import java.util.Optional;

import static org.mockito.Mockito.*;

class NotificationProducerServiceTest {

    @InjectMocks
    private NotificationProducerService notificationProducerService;

    @Mock
    private NotificationRepository notificationRepository;

    @Mock
    private CommentRepository commentRepository;

    @Mock
    private PostRepository postRepository;

    @BeforeEach
    void initMocks() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testCreateCommentNotification_whenCommentOnAnotherUserPost_shouldNotify() {
        Comment comment = mock(Comment.class);
        Post post = mock(Post.class);

        when(comment.getPost()).thenReturn(post);
        when(comment.getParentComment()).thenReturn(null);
        when(comment.getUsername()).thenReturn("bob");
        when(post.getUsername()).thenReturn("alice");
        when(post.getTitle()).thenReturn("Interesting Post");

        notificationProducerService.createCommentNotification(comment);

        verify(notificationRepository).save(argThat(notification -> notification.getUsername().equals("alice") &&
                notification.getMessage().contains("bob has commented on your post")));
    }

    @Test
    void testCreateCommentNotification_whenReplyToAnotherUser_shouldNotify() {
        Comment comment = mock(Comment.class);
        Comment parent = mock(Comment.class);

        when(comment.getParentComment()).thenReturn(parent);
        when(comment.getUsername()).thenReturn("bob");
        when(parent.getUsername()).thenReturn("alice");
        when(parent.getContent()).thenReturn("Nice work!");

        notificationProducerService.createCommentNotification(comment);

        verify(notificationRepository).save(argThat(notification -> notification.getUsername().equals("alice") &&
                notification.getMessage().contains("bob has replied to your comment")));
    }

    @Test
    void testCreateCommentNotification_whenCommentOnOwnPost_shouldNotNotify() {
        Comment comment = mock(Comment.class);
        Post post = mock(Post.class);

        when(comment.getPost()).thenReturn(post);
        when(comment.getUsername()).thenReturn("alice");
        when(post.getUsername()).thenReturn("alice");
        when(comment.getParentComment()).thenReturn(null);

        notificationProducerService.createCommentNotification(comment);

        verify(notificationRepository, never()).save(any());
    }

    @Test
    void testCreateCommentNotification_whenReplyToOwnComment_shouldNotNotify() {
        Comment comment = mock(Comment.class);
        Comment parent = mock(Comment.class);

        when(comment.getParentComment()).thenReturn(parent);
        when(comment.getUsername()).thenReturn("alice");
        when(parent.getUsername()).thenReturn("alice");

        notificationProducerService.createCommentNotification(comment);

        verify(notificationRepository, never()).save(any());
    }

    @Test
    void testCreateLikeCommentNotification_shouldNotifyOriginalCommenter() {
        CommentLike like = new CommentLike();
        like.setCommentId(1L);
        like.setUsername("bob");

        Comment comment = new Comment();
        comment.setUsername("alice");
        comment.setContent("Great post!");

        when(commentRepository.findById(1L)).thenReturn(Optional.of(comment));

        notificationProducerService.createLikeCommentNotification(like);

        verify(notificationRepository).save(argThat(notification -> notification.getUsername().equals("alice") &&
                notification.getMessage().contains("bob liked your comment")));
    }

    @Test
    void testCreateLikePostNotification_shouldNotifyOriginalPoster() {
        PostLike like = new PostLike();
        like.setPostId(10L);
        like.setUsername("bob");

        Post post = new Post();
        post.setUsername("alice");
        post.setTitle("Weekly Recap");

        when(postRepository.findById(10L)).thenReturn(Optional.of(post));

        notificationProducerService.createLikePostNotification(like);

        verify(notificationRepository).save(argThat(notification -> notification.getUsername().equals("alice") &&
                notification.getMessage().contains("bob liked your post")));
    }
}
