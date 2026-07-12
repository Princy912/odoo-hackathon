package com.transitops.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.transitops.entity.Driver;
import com.transitops.entity.DriverStatus;
import com.transitops.exception.DuplicateResourceException;
import com.transitops.exception.ResourceNotFoundException;
import com.transitops.repository.DriverRepository;

@Service
public class DriverService {

    private final DriverRepository driverRepository;

    public DriverService(DriverRepository driverRepository) {
        this.driverRepository = driverRepository;
    }

    public Driver create(Driver driver) {
        if (driverRepository.existsByLicenseNumber(driver.getLicenseNumber())) {
            throw new DuplicateResourceException(
                    "A driver with license number '" + driver.getLicenseNumber() + "' already exists");
        }
        if (driver.getStatus() == null) {
            driver.setStatus(DriverStatus.AVAILABLE);
        }
        if (driver.getSafetyScore() == 0) {
            driver.setSafetyScore(100);
        }
        return driverRepository.save(driver);
    }

    public Driver update(Long id, Driver updated) {
        Driver existing = getById(id);

        if (!existing.getLicenseNumber().equals(updated.getLicenseNumber())
                && driverRepository.existsByLicenseNumber(updated.getLicenseNumber())) {
            throw new DuplicateResourceException(
                    "A driver with license number '" + updated.getLicenseNumber() + "' already exists");
        }

        existing.setName(updated.getName());
        existing.setLicenseNumber(updated.getLicenseNumber());
        existing.setLicenseCategory(updated.getLicenseCategory());
        existing.setLicenseExpiry(updated.getLicenseExpiry());
        existing.setContactNumber(updated.getContactNumber());
        existing.setSafetyScore(updated.getSafetyScore());
        existing.setStatus(updated.getStatus());

        return driverRepository.save(existing);
    }

    public Driver getById(Long id) {
        return driverRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Driver " + id + " not found"));
    }

    /**
     * Phase 1: filter by status.
     * Phase 4: also filters by free-text search across name + licenseNumber.
     */
    public List<Driver> list(DriverStatus status, String search) {
        String normalizedSearch = (search == null || search.isBlank()) ? null : search.trim();
        return driverRepository.search(status, normalizedSearch);
    }
}