package com.agendamentos.api.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Servico {
    private String id;
    private String nome;
    private Double preco;
    private String moeda; // BRL, USD
    private Integer duracaoMinutos;
    private Integer intervaloMinutos;
}
