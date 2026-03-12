package com.agendamentos.api.controllers;

import com.agendamentos.api.models.Servico;
import com.agendamentos.api.services.ServicoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/public/servicos")
public class PublicServicoController {

    private final ServicoService servicoService;

    public PublicServicoController(ServicoService servicoService) {
        this.servicoService = servicoService;
    }

    @GetMapping
    public ResponseEntity<List<Servico>> listar() {
        try {
            return ResponseEntity.ok(servicoService.listarServicos());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
