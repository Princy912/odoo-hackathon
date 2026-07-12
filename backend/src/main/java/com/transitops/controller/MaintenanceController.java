package com.transitops.controller;

import com.transitops.dto.MaintenanceRequest;
import com.transitops.entity.MaintenanceLog;
import com.transitops.service.MaintenanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/maintenance")
@RequiredArgsConstructor
public class MaintenanceController {

    private final MaintenanceService maintenanceService;

    @GetMapping
    public ResponseEntity<List<MaintenanceLog>> getAllMaintenanceLogs() {
        return ResponseEntity.ok(maintenanceService.findAll());
    }

    @PostMapping
    public ResponseEntity<MaintenanceLog> createMaintenance(@RequestBody MaintenanceRequest request) {
        return ResponseEntity.ok(maintenanceService.createMaintenance(request));
    }

    @PutMapping("/{id}/close")
    public ResponseEntity<MaintenanceLog> closeMaintenance(@PathVariable Long id) {
        return ResponseEntity.ok(maintenanceService.closeMaintenance(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<MaintenanceLog> updateMaintenance(@PathVariable Long id, @RequestBody MaintenanceRequest request) {
        return ResponseEntity.ok(maintenanceService.updateMaintenance(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMaintenance(@PathVariable Long id) {
        maintenanceService.deleteMaintenance(id);
        return ResponseEntity.noContent().build();
    }
}
