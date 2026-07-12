package com.transitops.controller;

import com.transitops.entity.Driver;
import com.transitops.entity.DriverStatus;
import com.transitops.service.DriverService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/drivers")
@RequiredArgsConstructor
public class DriverController {

    private final DriverService driverService;

    @GetMapping
    public ResponseEntity<List<Driver>> getAll(@RequestParam(required = false) DriverStatus status) {
        return ResponseEntity.ok(driverService.findAll(status));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Driver> getOne(@PathVariable Long id) {
        return ResponseEntity.ok(driverService.findById(id));
    }

    @PreAuthorize("hasRole('FLEET_MANAGER')")
    @PostMapping
    public ResponseEntity<Driver> create(@RequestBody Driver driver) {
        Driver saved = driverService.create(driver);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PreAuthorize("hasRole('FLEET_MANAGER')")
    @PutMapping("/{id}")
    public ResponseEntity<Driver> update(@PathVariable Long id, @RequestBody Driver driver) {
        return ResponseEntity.ok(driverService.update(id, driver));
    }
}