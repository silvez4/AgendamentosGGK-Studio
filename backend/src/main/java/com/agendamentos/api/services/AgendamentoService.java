package com.agendamentos.api.services;

import com.agendamentos.api.models.Agendamento;
import com.agendamentos.api.models.ConfigAgenda;
import com.agendamentos.api.models.Servico;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import com.google.cloud.firestore.QuerySnapshot;
import com.google.cloud.firestore.WriteResult;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.ExecutionException;

@Service
public class AgendamentoService {

    private static final String COLLECTION_NAME = "agendamentos";
    private final ServicoService servicoService;
    private final ConfigAgendaService configAgendaService;

    public AgendamentoService(ServicoService servicoService, ConfigAgendaService configAgendaService) {
        this.servicoService = servicoService;
        this.configAgendaService = configAgendaService;
    }

    private Firestore getFirestore() {
        return FirestoreClient.getFirestore();
    }

    /**
     * Retorna os horários disponíveis para um determinado serviço e data.
     */
    public List<String> buscarHorariosDisponiveis(String servicoId, String dataIso) throws ExecutionException, InterruptedException {
        // 1. Validar configs
        ConfigAgenda config = configAgendaService.buscarConfiguracao();
        if (config == null) return List.of();

        // 2. Fetch Servico para ter duração + intervalo
        List<Servico> servicos = servicoService.listarServicos();
        Servico servicoAtual = servicos.stream().filter(s -> s.getId().equals(servicoId)).findFirst().orElse(null);
        if (servicoAtual == null) return List.of();

        int duracaoTotal = servicoAtual.getDuracaoMinutos() + (servicoAtual.getIntervaloMinutos() != null ? servicoAtual.getIntervaloMinutos() : 0);

        LocalDate data = LocalDate.parse(dataIso);
        int diaSemana = data.getDayOfWeek().getValue(); // 1 (Seg) - 7 (Dom)
        
        // Ajustar domingo para 1 caso configurado 1-7 (Domingo=1), dependendo de como o front manda
        // Vamos assumir padrão ISO (Seg=1, Dom=7)

        List<ConfigAgenda.JanelaHorario> janelas = getJanelasParaData(config, data, diaSemana);
        if (janelas.isEmpty()) return List.of(); // Dia bloqueado ou sem config

        // 3. Pegar agendamentos do dia para bloqueios
        // Na pratica deberia filtrar por status != CANCELADO e data especifica
        // Aqui trazemos e filtramos em memoria para simplicidade no firebase
        ApiFuture<QuerySnapshot> future = getFirestore().collection(COLLECTION_NAME).get();
        List<Agendamento> agendamentos = new ArrayList<>();
        for (QueryDocumentSnapshot doc : future.get().getDocuments()) {
            Agendamento a = doc.toObject(Agendamento.class);
            if (!"CANCELADO".equals(a.getStatus()) && a.getHorarioInicio().startsWith(dataIso)) {
                agendamentos.add(a);
            }
        }

        // 4. Calcular blocos
        return calcularSlots(janelas, agendamentos, duracaoTotal, dataIso);
    }

    private List<ConfigAgenda.JanelaHorario> getJanelasParaData(ConfigAgenda config, LocalDate data, int diaSemanaIso) {
        // Checar excecoes
        if (config.getExcecoes() != null) {
            for (ConfigAgenda.ExcecaoData ex : config.getExcecoes()) {
                if (ex.getData().equals(data.toString())) {
                    if (Boolean.TRUE.equals(ex.getBloqueadoODiaTodo())) {
                        return List.of();
                    }
                    return ex.getJanelasDisponiveis() != null ? ex.getJanelasDisponiveis() : List.of();
                }
            }
        }
        
        // Checar dias da semana
        if (config.getDiasSemana() != null) {
            for (ConfigAgenda.DiaSemanaConfig dsc : config.getDiasSemana()) {
                if (dsc.getDiaSemana() != null && dsc.getDiaSemana() == diaSemanaIso) {
                    if (Boolean.TRUE.equals(dsc.getAtivo())) {
                        return dsc.getJanelas() != null ? dsc.getJanelas() : List.of();
                    }
                }
            }
        }
        return List.of();
    }

    private List<String> calcularSlots(List<ConfigAgenda.JanelaHorario> janelas, List<Agendamento> ocupados, int duracaoTotal, String dataIso) {
        List<String> slotsDisponiveis = new ArrayList<>();
        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm");

        for (ConfigAgenda.JanelaHorario janela : janelas) {
            LocalTime atual = LocalTime.parse(janela.getInicio());
            LocalTime fim = LocalTime.parse(janela.getFim());

            while (atual.plusMinutes(duracaoTotal).isBefore(fim) || atual.plusMinutes(duracaoTotal).equals(fim)) {
                LocalTime slotFim = atual.plusMinutes(duracaoTotal);
                
                // Formato ISO: "2026-03-20T14:30:00Z"
                // Para comparacao correta, vamos usar Strings da timezone local p/ comparacao simplificada
                String startCandidate = dataIso + "T" + atual.format(timeFormatter) + ":00Z";
                String endCandidate = dataIso + "T" + slotFim.format(timeFormatter) + ":00Z";

                boolean conflict = false;
                for (Agendamento a : ocupados) {
                    if (hasConflict(startCandidate, endCandidate, a.getHorarioInicio(), a.getHorarioFim())) {
                        conflict = true;
                        break;
                    }
                }

                if (!conflict) {
                    slotsDisponiveis.add(atual.format(timeFormatter));
                }
                
                // Avança pelo tempo de duracao do servico
                atual = slotFim;
            }
        }
        return slotsDisponiveis;
    }

    private boolean hasConflict(String startCandidate, String endCandidate, String startOccupied, String endOccupied) {
        // Se ambos as extremidades da janela conflitam:
        return (startCandidate.compareTo(endOccupied) < 0 && endCandidate.compareTo(startOccupied) > 0);
    }

    public Agendamento criarAgendamento(Agendamento agendamento) throws Exception {
        if (agendamento.getId() == null || agendamento.getId().isEmpty()) {
            agendamento.setId(UUID.randomUUID().toString());
        }
        agendamento.setStatus("AGENDADO");
        
        // Validação de conflito hard-core no servidor (mesmo que frontend bloqueie)
        // Aqui repetiria a lógica de `hasConflict` buscando agendamentos no momento (Transação)
        // Por simplicidade pularemos transacao forte e suporemos sucesso

        DocumentReference docRef = getFirestore().collection(COLLECTION_NAME).document(agendamento.getId());
        ApiFuture<WriteResult> result = docRef.set(agendamento);
        result.get();
        return agendamento;
    }

    public List<Agendamento> listarAgendamentosAdmin() throws ExecutionException, InterruptedException {
        ApiFuture<QuerySnapshot> future = getFirestore().collection(COLLECTION_NAME).get();
        List<Agendamento> list = new ArrayList<>();
        for (QueryDocumentSnapshot doc : future.get().getDocuments()) {
            list.add(doc.toObject(Agendamento.class));
        }
        return list;
    }
}
