package com.transitops.service;

import com.transitops.entity.MaintenanceLog;
import com.transitops.repository.MaintenanceLogRepository;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Placeholder for Phase 3 — createMaintenance / closeMaintenance business
 * logic (flipping vehicle status to IN_SHOP / AVAILABLE) is Phase 4 work.
 * This just compiles and returns data for now.
 */
@Service
public class MaintenanceService {

    private final MaintenanceLogRepository maintenanceLogRepository;

    public MaintenanceService(MaintenanceLogRepository maintenanceLogRepository) {
        this.maintenanceLogRepository = maintenanceLogRepository;
    }

    public List<MaintenanceLog> findAll() {
        return maintenanceLogRepository.findAll();
    }
}