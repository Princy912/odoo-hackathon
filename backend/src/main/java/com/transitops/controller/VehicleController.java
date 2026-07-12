package com.transitops.controller;

import com.transitops.entity.Vehicle;
import com.transitops.entity.VehicleStatus;
import com.transitops.service.VehicleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

// NOTE: security is intentionally NOT wired here yet (Phase 1). Endpoints are open.
// Once feature/auth merges in, restrict per docs/AUTH.md (e.g. only FLEET_MANAGER
// should be able to hit POST/PUT/DELETE).
@RestController
@RequestMapping("/api/vehicles")
@RequiredArgsConstructor
public class VehicleController {

    private final VehicleService vehicleService;

    @GetMapping
    public ResponseEntity<List<Vehicle>> getAll(
            @RequestParam(required = false) VehicleStatus status,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String region) {
        return ResponseEntity.ok(vehicleService.findAll(status, type, region));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Vehicle> getOne(@PathVariable Long id) {
        return ResponseEntity.ok(vehicleService.findById(id));
    }

    @PostMapping
    public ResponseEntity<Vehicle> create(@RequestBody Vehicle vehicle) {
        Vehicle saved = vehicleService.create(vehicle);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Vehicle> update(@PathVariable Long id, @RequestBody Vehicle vehicle) {
        return ResponseEntity.ok(vehicleService.update(id, vehicle));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        vehicleService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
