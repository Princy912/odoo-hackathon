package com.transitops.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.transitops.entity.Driver;
import com.transitops.entity.DriverStatus;
import com.transitops.service.DriverService;

// NOTE: security intentionally left open here (Phase 1 scope), same as VehicleController.
@RestController
@RequestMapping("/api/drivers")
public class DriverController {

    private final DriverService driverService;

    public DriverController(DriverService driverService) {
        this.driverService = driverService;
    }

    // GET /api/drivers?status=&search=
    @GetMapping
    public List<Driver> list(
            @RequestParam(required = false) DriverStatus status,
            @RequestParam(required = false) String search) {
        return driverService.list(status, search);
    }

    @GetMapping("/{id}")
    public Driver getOne(@PathVariable Long id) {
        return driverService.getById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Driver create(@RequestBody Driver driver) {
        return driverService.create(driver);
    }

    @PutMapping("/{id}")
    public Driver update(@PathVariable Long id, @RequestBody Driver driver) {
        return driverService.update(id, driver);
    }
}