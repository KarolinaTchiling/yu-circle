package com.yucircle.profileapp;

import com.yucircle.profileapp.controller.FileUploadController;
import com.yucircle.profileapp.service.GoogleDriveService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.web.servlet.MockMvc;

import java.io.File;

import static org.hamcrest.Matchers.containsString;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(FileUploadController.class)
@ContextConfiguration(classes = { FileUploadControllerTest.TestConfig.class })
public class FileUploadControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private GoogleDriveService googleDriveService;

    @Configuration
    static class TestConfig {
        @Bean
        public FileUploadController fileUploadController(GoogleDriveService googleDriveService) {
            return new FileUploadController(googleDriveService);
        }
    }

    @Test
    void testUploadFileSuccess() throws Exception {
        MockMultipartFile multipartFile = new MockMultipartFile(
                "file",
                "test.txt",
                MediaType.TEXT_PLAIN_VALUE,
                "Hello, world!".getBytes());

        Mockito.when(googleDriveService.uploadFile(any(File.class), anyString()))
                .thenReturn("https://drive.google.com/test-file-url");

        mockMvc.perform(multipart("/profiles/upload")
                .file(multipartFile))
                .andExpect(status().isOk())
                .andExpect(content().string("https://drive.google.com/test-file-url"));
    }

    @Test
    void testUploadFileFailure() throws Exception {
        MockMultipartFile multipartFile = new MockMultipartFile(
                "file",
                "fail.txt",
                MediaType.TEXT_PLAIN_VALUE,
                "fail".getBytes());

        Mockito.when(googleDriveService.uploadFile(any(File.class), anyString()))
                .thenThrow(new RuntimeException("Upload failed"));

        mockMvc.perform(multipart("/profiles/upload")
                .file(multipartFile))
                .andExpect(status().is5xxServerError())
                .andExpect(content().string(containsString("Error: Upload failed")));
    }
}
