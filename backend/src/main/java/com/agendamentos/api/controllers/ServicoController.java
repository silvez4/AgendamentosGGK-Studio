package com.agendamentos.api.controllers;

import com.agendamentos.api.models.Servico;
import com.agendamentos.api.services.ServicoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/servicos")
public class ServicoController {

    private final ServicoService servicoService;

    public ServicoController(ServicoService servicoService) {
        this.servicoService = servicoService;
    }

    @PostMapping
    public ResponseEntity<Servico> criar(@RequestBody Servico servico) {
        try {
            return ResponseEntity.ok(servicoService.criarServico(servico));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping
    public ResponseEntity<List<Servico>> listar() {
        try {
            return ResponseEntity.ok(servicoService.listarServicos());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Servico> atualizar(@PathVariable String id, @RequestBody Servico servico) {
        try {
            return ResponseEntity.ok(servicoService.atualizarServico(id, servico));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable String id) {
        try {
            servicoService.deletarServico(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
