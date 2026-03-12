package com.agendamentos.api.services;

import com.agendamentos.api.models.ConfigAgenda;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import com.google.cloud.firestore.QuerySnapshot;
import com.google.cloud.firestore.WriteResult;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.stereotype.Service;

import java.util.concurrent.ExecutionException;
import java.util.List;

@Service
public class ConfigAgendaService {

    private static final String COLLECTION_NAME = "config_agenda";
    private static final String SINGLETON_DOC_ID = "geral";

    private Firestore getFirestore() {
        return FirestoreClient.getFirestore();
    }

    public ConfigAgenda salvarConfiguracao(ConfigAgenda config) throws ExecutionException, InterruptedException {
        config.setId(SINGLETON_DOC_ID); // Temos apenas 1 prestador e 1 agenda geral por enquanto
        DocumentReference docRef = getFirestore().collection(COLLECTION_NAME).document(SINGLETON_DOC_ID);
        ApiFuture<WriteResult> result = docRef.set(config);
        result.get();
        return config;
    }

    public ConfigAgenda buscarConfiguracao() throws ExecutionException, InterruptedException {
        ApiFuture<QuerySnapshot> future = getFirestore().collection(COLLECTION_NAME).limit(1).get();
        List<QueryDocumentSnapshot> documents = future.get().getDocuments();
        if (documents.isEmpty()) {
            return null;
        }
        return documents.get(0).toObject(ConfigAgenda.class);
    }
}
