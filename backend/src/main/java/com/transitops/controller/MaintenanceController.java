package com.transitops.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/maintenance")
public class MaintenanceController {

    @GetMapping
    public ResponseEntity<String> getAllMaintenanceLogs() {
        return ResponseEntity.ok("Maintenance placeholder endpoint");
    }

    @PostMapping
    public ResponseEntity<String> createMaintenance() {
        return ResponseEntity.ok("Create maintenance placeholder endpoint");
    }
}
