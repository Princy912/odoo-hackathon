package com.transitops.service;

import com.transitops.entity.Driver;
import com.transitops.entity.DriverStatus;
import com.transitops.exception.DuplicateResourceException;
import com.transitops.exception.ResourceNotFoundException;
import com.transitops.repository.DriverRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DriverService {

    private final DriverRepository driverRepository;

    public Driver create(Driver driver) {
        if (driver.getLicenseNumber() == null || driver.getLicenseNumber().isBlank()) {
            throw new IllegalArgumentException("licenseNumber is required");
        }
        if (driverRepository.existsByLicenseNumber(driver.getLicenseNumber())) {
            throw new DuplicateResourceException(
                    "A driver with licenseNumber '" + driver.getLicenseNumber() + "' already exists");
        }
        if (driver.getStatus() == null) {
            driver.setStatus(DriverStatus.AVAILABLE);
        }
        if (driver.getSafetyScore() == null) {
            driver.setSafetyScore(100);
        }
        return driverRepository.save(driver);
    }

    public List<Driver> findAll(DriverStatus status) {
        if (status == null) {
            return driverRepository.findAll();
        }
        return driverRepository.findByStatus(status);
    }

    public Driver findById(Long id) {
        return driverRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Driver not found with id " + id));
    }

    public Driver update(Long id, Driver updated) {
        Driver existing = findById(id);

        if (updated.getLicenseNumber() != null && !updated.getLicenseNumber().equals(existing.getLicenseNumber())) {
            if (driverRepository.existsByLicenseNumber(updated.getLicenseNumber())) {
                throw new DuplicateResourceException(
                        "A driver with licenseNumber '" + updated.getLicenseNumber() + "' already exists");
            }
            existing.setLicenseNumber(updated.getLicenseNumber());
        }
        if (updated.getName() != null) existing.setName(updated.getName());
        if (updated.getLicenseCategory() != null) existing.setLicenseCategory(updated.getLicenseCategory());
        if (updated.getLicenseExpiry() != null) existing.setLicenseExpiry(updated.getLicenseExpiry());
        if (updated.getContactNumber() != null) existing.setContactNumber(updated.getContactNumber());
        if (updated.getSafetyScore() != null) existing.setSafetyScore(updated.getSafetyScore());
        if (updated.getStatus() != null) existing.setStatus(updated.getStatus());

        return driverRepository.save(existing);
    }

    // Not exposed via controller in Phase 1 spec (Driver has no DELETE endpoint),
    // kept here in case a later phase needs it.
    public void delete(Long id) {
        Driver existing = findById(id);
        driverRepository.delete(existing);
    }
}
