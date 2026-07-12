package com.transitops.service;

import com.transitops.entity.Vehicle;
import com.transitops.entity.VehicleStatus;
import com.transitops.exception.DuplicateResourceException;
import com.transitops.exception.ResourceNotFoundException;
import com.transitops.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class VehicleService {

    private final VehicleRepository vehicleRepository;

    public Vehicle create(Vehicle vehicle) {
        if (vehicle.getRegNumber() == null || vehicle.getRegNumber().isBlank()) {
            throw new IllegalArgumentException("regNumber is required");
        }
        if (vehicleRepository.existsByRegNumber(vehicle.getRegNumber())) {
            throw new DuplicateResourceException(
                    "A vehicle with regNumber '" + vehicle.getRegNumber() + "' already exists");
        }
        if (vehicle.getStatus() == null) {
            vehicle.setStatus(VehicleStatus.AVAILABLE);
        }
        return vehicleRepository.save(vehicle);
    }

    public List<Vehicle> findAll(VehicleStatus status, String type, String region) {
        if (status == null && type == null && region == null) {
            return vehicleRepository.findAll();
        }
        return vehicleRepository.search(status, type, region);
    }

    public Vehicle findById(Long id) {
        return vehicleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found with id " + id));
    }

    public Vehicle update(Long id, Vehicle updated) {
        Vehicle existing = findById(id);

        if (updated.getRegNumber() != null && !updated.getRegNumber().equals(existing.getRegNumber())) {
            if (vehicleRepository.existsByRegNumber(updated.getRegNumber())) {
                throw new DuplicateResourceException(
                        "A vehicle with regNumber '" + updated.getRegNumber() + "' already exists");
            }
            existing.setRegNumber(updated.getRegNumber());
        }
        if (updated.getModel() != null) existing.setModel(updated.getModel());
        if (updated.getType() != null) existing.setType(updated.getType());
        if (updated.getMaxLoadCapacity() != null) existing.setMaxLoadCapacity(updated.getMaxLoadCapacity());
        if (updated.getOdometer() != null) existing.setOdometer(updated.getOdometer());
        if (updated.getAcquisitionCost() != null) existing.setAcquisitionCost(updated.getAcquisitionCost());
        if (updated.getRegion() != null) existing.setRegion(updated.getRegion());
        if (updated.getStatus() != null) existing.setStatus(updated.getStatus());

        return vehicleRepository.save(existing);
    }

    public void delete(Long id) {
        Vehicle existing = findById(id);
        vehicleRepository.delete(existing);
    }
}
