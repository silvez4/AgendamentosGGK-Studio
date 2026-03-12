package com.agendamentos.api.controllers;

import com.agendamentos.api.models.Agendamento;
import com.agendamentos.api.services.AgendamentoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class AgendamentoController {

    private final AgendamentoService agendamentoService;

    public AgendamentoController(AgendamentoService agendamentoService) {
        this.agendamentoService = agendamentoService;
    }

    // -- PUBLIC ENDPOINTS --

    @GetMapping("/public/agendamentos/disponibilidade")
    public ResponseEntity<List<String>> getDisponibilidade(
            @RequestParam String servicoId, 
            @RequestParam String data) { // format: YYYY-MM-DD
        try {
            return ResponseEntity.ok(agendamentoService.buscarHorariosDisponiveis(servicoId, data));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/public/agendamentos")
    public ResponseEntity<Agendamento> criarPublic(@RequestBody Agendamento agendamento) {
        try {
            return ResponseEntity.ok(agendamentoService.criarAgendamento(agendamento));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }


    // -- ADMIN ENDPOINTS --

    @GetMapping("/admin/agendamentos")
    public ResponseEntity<List<Agendamento>> listarTodosAdmin() {
        try {
            return ResponseEntity.ok(agendamentoService.listarAgendamentosAdmin());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
