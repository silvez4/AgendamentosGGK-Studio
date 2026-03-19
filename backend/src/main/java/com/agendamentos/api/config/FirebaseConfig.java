package com.agendamentos.api.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import jakarta.annotation.PostConstruct;
import org.springframework.context.annotation.Configuration;

import java.io.InputStream;

@Configuration
public class FirebaseConfig {

    @PostConstruct
    public void initialize() {
        try {
            GoogleCredentials credentials;
            InputStream serviceAccount = getClass().getResourceAsStream("/serviceAccountKey.json");

            if (serviceAccount != null) {
                System.out.println("Local Firebase Credentials found.");
                credentials = GoogleCredentials.fromStream(serviceAccount);
            } else {
                System.out.println("Using Google Cloud Application Default Credentials.");
                credentials = GoogleCredentials.getApplicationDefault();
            }

            FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(credentials)
                    .build();

            if (FirebaseApp.getApps().isEmpty()) {
                FirebaseApp.initializeApp(options);
                System.out.println("Firebase Admin SDK initialized successfully.");
            }
        } catch (Exception e) {
            System.err.println("Error initializing Firebase: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
