package com.yucircle.profileapp.service;

import com.google.api.client.http.FileContent;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.services.drive.Drive;
import com.google.api.services.drive.DriveScopes;
import com.google.api.services.drive.model.File;
import com.google.api.services.drive.model.Permission;
import com.google.auth.http.HttpCredentialsAdapter;
import com.google.auth.oauth2.GoogleCredentials;

import org.springframework.stereotype.Service;

import java.io.FileInputStream;
import java.io.IOException;
import java.util.Collections;


@Service
public class GoogleDriveService {
    private final Drive driveService;

    public GoogleDriveService() throws IOException {
        GoogleCredentials credentials = GoogleCredentials.fromStream(new FileInputStream("credentials.json"))
                .createScoped(Collections.singletonList(DriveScopes.DRIVE_FILE));
        
        driveService = new Drive.Builder(new com.google.api.client.http.javanet.NetHttpTransport(), 
                                         GsonFactory.getDefaultInstance(), 
                                         new HttpCredentialsAdapter(credentials))
                     .setApplicationName("MarketplaceApp")
                     .build();
    }

    public String uploadFile(java.io.File file, String mimeType) throws IOException {
        File fileMetadata = new File();
        fileMetadata.setName(file.getName());

        FileContent mediaContent = new FileContent(mimeType, file);
        File uploadedFile = driveService.files().create(fileMetadata, mediaContent)
                .setFields("id")
                .execute();
        
        Permission permission = new Permission();
        permission.setType("anyone");
        permission.setRole("reader");
        driveService.permissions().create(uploadedFile.getId(), permission).execute();

        return "https://drive.google.com/uc?export=view&id=" + uploadedFile.getId();
    }
}