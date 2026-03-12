package com.agendamentos.api.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ConfigAgenda {
    private String id;
    private List<DiaSemanaConfig> diasSemana;
    private List<ExcecaoData> excecoes;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DiaSemanaConfig {
        private Integer diaSemana; // 1=Domingo, 2=Segunda, ..., 7=Sabado (ou 0-6 dependendo da convenção Java, usaremos 1-7 ISO)
        private Boolean ativo;
        private List<JanelaHorario> janelas;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class JanelaHorario {
        private String inicio; // "08:00"
        private String fim;    // "12:00"
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ExcecaoData {
        private String data; // ISO "YYYY-MM-DD"
        private Boolean bloqueadoODiaTodo;
        private List<JanelaHorario> janelasDisponiveis; // se nao for bloqueado o dia todo, sobrescreve o dia da semana
    }
}
