package com.yucircle.messagingapp;

import com.yucircle.messagingapp.controller.MessageController;

import com.yucircle.messagingapp.model.Message;
import com.yucircle.messagingapp.repository.MessageRepository;
import com.yucircle.messagingapp.service.MessageService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(MessageController.class)
public class MessageControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private MessageService messageService;

    @MockBean
    private MessageRepository messageRepository;

    private Message createMockMessage(Long id, String sender, String receiver, String content) {
        Message message = mock(Message.class);
        when(message.getSender()).thenReturn(sender);
        when(message.getReceiver()).thenReturn(receiver);
        when(message.getContent()).thenReturn(content);
        when(message.getTimestamp()).thenReturn(LocalDateTime.now());
        return message;
    }

    @Test
    void testGetConversation() throws Exception {
        Message message = createMockMessage(1L, "user1", "user2", "Hello!");
        when(messageService.getConversation("user1", "user2"))
                .thenReturn(List.of(message));

        mockMvc.perform(get("/messages/get")
                .param("user1", "user1")
                .param("user2", "user2"))
                .andExpect(status().isOk());
    }

    @Test
    void testSendMessage_success() throws Exception {
        String json = """
                {
                    "sender": "alice",
                    "receiver": "bob",
                    "content": "Hi there!"
                }
                """;

        when(messageRepository.save(any())).thenReturn(mock(Message.class));

        mockMvc.perform(post("/messages/send")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isOk())
                .andExpect(content().string("Message sent."));
    }

    @Test
    void testGetSentMessages() throws Exception {
        Message message = createMockMessage(1L, "alice", "bob", "Sent msg");
        when(messageService.getMessagesBySender("alice")).thenReturn(List.of(message));

        mockMvc.perform(get("/messages/sent")
                .param("sender", "alice"))
                .andExpect(status().isOk());
    }

    @Test
    void testGetReceivedMessages() throws Exception {
        Message message = createMockMessage(1L, "bob", "alice", "Received msg");
        when(messageService.getMessagesByReceiver("alice")).thenReturn(List.of(message));

        mockMvc.perform(get("/messages/received")
                .param("receiver", "alice"))
                .andExpect(status().isOk());
    }

    @Test
    void testDeleteMessage_success() throws Exception {
        when(messageRepository.existsById(10L)).thenReturn(true);
        doNothing().when(messageService).deleteMessage(10L);

        mockMvc.perform(delete("/messages/delete/10"))
                .andExpect(status().isOk())
                .andExpect(content().string("Message deleted."));
    }

    @Test
    void testDeleteMessage_notFound() throws Exception {
        when(messageRepository.existsById(99L)).thenReturn(false);

        mockMvc.perform(delete("/messages/delete/99"))
                .andExpect(status().isNotFound())
                .andExpect(content().string("Message not found."));
    }
}
