package com.agendamentos.api.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Agendamento {
    private String id;
    private String userId;
    private String servicoId;
    
    // Armazenando como strings ISO-8601 (ex: "2026-03-20T14:30:00Z")
    private String horarioInicio;
    private String horarioFim;
    
    private String status; // AGENDADO, CANCELADO, CONCLUIDO
    
    // Dados cache do usuario pro DB (para rapida visualizacao sem joins complexos)
    private String nomeCliente;
    private String emailCliente;
    private String telefoneCliente;
}
