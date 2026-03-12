package com.agendamentos.api.services;

import com.agendamentos.api.models.Servico;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import com.google.cloud.firestore.QuerySnapshot;
import com.google.cloud.firestore.WriteResult;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.ExecutionException;

@Service
public class ServicoService {

    private static final String COLLECTION_NAME = "servicos";

    private Firestore getFirestore() {
        return FirestoreClient.getFirestore();
    }

    public Servico criarServico(Servico servico) throws ExecutionException, InterruptedException {
        if (servico.getId() == null || servico.getId().isEmpty()) {
            servico.setId(UUID.randomUUID().toString());
        }
        DocumentReference docRef = getFirestore().collection(COLLECTION_NAME).document(servico.getId());
        ApiFuture<WriteResult> result = docRef.set(servico);
        result.get(); // Bloqueia ate resolver (Async no Spring seria melhor, mas para startup simplificado ok)
        return servico;
    }

    public Servico atualizarServico(String id, Servico servico) throws ExecutionException, InterruptedException {
        servico.setId(id);
        DocumentReference docRef = getFirestore().collection(COLLECTION_NAME).document(id);
        ApiFuture<WriteResult> result = docRef.set(servico);
        result.get();
        return servico;
    }

    public List<Servico> listarServicos() throws ExecutionException, InterruptedException {
        ApiFuture<QuerySnapshot> future = getFirestore().collection(COLLECTION_NAME).get();
        List<QueryDocumentSnapshot> documents = future.get().getDocuments();
        List<Servico> servicos = new ArrayList<>();
        for (QueryDocumentSnapshot document : documents) {
            servicos.add(document.toObject(Servico.class));
        }
        return servicos;
    }

    public void deletarServico(String id) throws ExecutionException, InterruptedException {
        ApiFuture<WriteResult> writeResult = getFirestore().collection(COLLECTION_NAME).document(id).delete();
        writeResult.get();
    }
}
