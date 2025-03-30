package com.yucircle.profileapp.controller;

import com.yucircle.profileapp.service.GoogleDriveService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;

@RestController
@RequestMapping("/profiles")
public class FileUploadController {

    private final GoogleDriveService googleDriveService;

    public FileUploadController(GoogleDriveService googleDriveService) {
        this.googleDriveService = googleDriveService;
    }

    @PostMapping("/upload")
    public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile multipartFile) {
        try {
            File file = convertMultiPartToFile(multipartFile);
            String fileUrl = googleDriveService.uploadFile(file, multipartFile.getContentType());
            file.delete();
            return ResponseEntity.ok(fileUrl);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }

    private File convertMultiPartToFile(MultipartFile file) throws IOException {
        File convFile = new File(file.getOriginalFilename());
        try (FileOutputStream fos = new FileOutputStream(convFile)) {
            fos.write(file.getBytes());
        }
        return convFile;
    }
}