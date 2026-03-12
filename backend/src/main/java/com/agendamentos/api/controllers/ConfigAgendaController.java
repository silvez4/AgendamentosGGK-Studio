package com.agendamentos.api.controllers;

import com.agendamentos.api.models.ConfigAgenda;
import com.agendamentos.api.services.ConfigAgendaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/config-agenda")
public class ConfigAgendaController {

    private final ConfigAgendaService configService;

    public ConfigAgendaController(ConfigAgendaService configService) {
        this.configService = configService;
    }

    @PostMapping
    public ResponseEntity<ConfigAgenda> salvarConfig(@RequestBody ConfigAgenda config) {
        try {
            return ResponseEntity.ok(configService.salvarConfiguracao(config));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping
    public ResponseEntity<ConfigAgenda> buscarConfig() {
        try {
            ConfigAgenda config = configService.buscarConfiguracao();
            return config != null ? ResponseEntity.ok(config) : ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
