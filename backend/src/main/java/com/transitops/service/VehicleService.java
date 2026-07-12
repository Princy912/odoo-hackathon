package com.transitops.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.transitops.entity.Vehicle;
import com.transitops.entity.VehicleStatus;
import com.transitops.exception.DuplicateResourceException;
import com.transitops.exception.ResourceNotFoundException;
import com.transitops.repository.VehicleRepository;

@Service
public class VehicleService {

    private final VehicleRepository vehicleRepository;

    public VehicleService(VehicleRepository vehicleRepository) {
        this.vehicleRepository = vehicleRepository;
    }

    public Vehicle create(Vehicle vehicle) {
        if (vehicleRepository.existsByRegNumber(vehicle.getRegNumber())) {
            throw new DuplicateResourceException(
                    "A vehicle with registration number '" + vehicle.getRegNumber() + "' already exists");
        }
        if (vehicle.getStatus() == null) {
            vehicle.setStatus(VehicleStatus.AVAILABLE);
        }
        return vehicleRepository.save(vehicle);
    }

    public Vehicle update(Long id, Vehicle updated) {
        Vehicle existing = getById(id);

        // If regNumber is changing, re-check uniqueness
        if (!existing.getRegNumber().equals(updated.getRegNumber())
                && vehicleRepository.existsByRegNumber(updated.getRegNumber())) {
            throw new DuplicateResourceException(
                    "A vehicle with registration number '" + updated.getRegNumber() + "' already exists");
        }

        existing.setRegNumber(updated.getRegNumber());
        existing.setModel(updated.getModel());
        existing.setType(updated.getType());
        existing.setMaxLoadCapacity(updated.getMaxLoadCapacity());
        existing.setOdometer(updated.getOdometer());
        existing.setAcquisitionCost(updated.getAcquisitionCost());
        existing.setRegion(updated.getRegion());
        existing.setStatus(updated.getStatus());

        return vehicleRepository.save(existing);
    }

    public void delete(Long id) {
        Vehicle existing = getById(id);
        vehicleRepository.delete(existing);
    }

    public Vehicle getById(Long id) {
        return vehicleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle " + id + " not found"));
    }

    /**
     * Phase 1: filter by status/type/region.
     * Phase 4: also filters by free-text search across regNumber + model.
     * Any/all params may be null.
     */
    public List<Vehicle> list(VehicleStatus status, String type, String region, String search) {
        String normalizedSearch = (search == null || search.isBlank()) ? null : search.trim();
        return vehicleRepository.search(status, type, region, normalizedSearch);
    }

    /** Used by Trip creation dropdown (Phase 4, Member 3 dependency): only vehicles fit for dispatch. */
    public List<Vehicle> listAvailableForDispatch() {
        return vehicleRepository.findByStatus(VehicleStatus.AVAILABLE);
    }
}