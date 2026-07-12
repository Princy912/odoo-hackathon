package com.transitops.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.transitops.entity.Vehicle;
import com.transitops.entity.VehicleStatus;
import com.transitops.service.VehicleService;

// NOTE: security is intentionally left open here (Phase 1 scope). Once
// feature/auth is merged, restrict POST/PUT/DELETE to FLEET_MANAGER per
// docs/AUTH.md, e.g. @PreAuthorize("hasRole('FLEET_MANAGER')").
@RestController
@RequestMapping("/api/vehicles")
public class VehicleController {

    private final VehicleService vehicleService;

    public VehicleController(VehicleService vehicleService) {
        this.vehicleService = vehicleService;
    }

    // GET /api/vehicles?status=&type=&region=&search=
    @GetMapping
    public List<Vehicle> list(
            @RequestParam(required = false) VehicleStatus status,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String region,
            @RequestParam(required = false) String search) {
        return vehicleService.list(status, type, region, search);
    }

    @GetMapping("/{id}")
    public Vehicle getOne(@PathVariable Long id) {
        return vehicleService.getById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Vehicle create(@RequestBody Vehicle vehicle) {
        return vehicleService.create(vehicle);
    }

    @PutMapping("/{id}")
    public Vehicle update(@PathVariable Long id, @RequestBody Vehicle vehicle) {
        return vehicleService.update(id, vehicle);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        vehicleService.delete(id);
    }
}