package com.transitops.service;

import com.transitops.dto.MaintenanceRequest;
import com.transitops.entity.MaintenanceLog;
import com.transitops.entity.Vehicle;
import com.transitops.entity.VehicleStatus;
import com.transitops.repository.MaintenanceLogRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MaintenanceService {

    private final MaintenanceLogRepository maintenanceLogRepository;
    private final VehicleService vehicleService;

    public MaintenanceService(MaintenanceLogRepository maintenanceLogRepository, VehicleService vehicleService) {
        this.maintenanceLogRepository = maintenanceLogRepository;
        this.vehicleService = vehicleService;
    }

    public List<MaintenanceLog> findAll() {
        return maintenanceLogRepository.findAll();
    }

    @org.springframework.transaction.annotation.Transactional
    public MaintenanceLog createMaintenance(MaintenanceRequest request) {
        Vehicle vehicle = vehicleService.getById(request.getVehicleId());
        
        // Transition vehicle status to IN_SHOP
        vehicle.setStatus(VehicleStatus.IN_SHOP);
        vehicleService.update(vehicle.getId(), vehicle);

        MaintenanceLog log = new MaintenanceLog();
        log.setVehicle(vehicle);
        log.setType(request.getType());
        log.setCost(request.getCost());
        log.setServiceDate(request.getServiceDate());
        log.setStatus(MaintenanceLog.MaintenanceStatus.ACTIVE);

        return maintenanceLogRepository.save(log);
    }

    @org.springframework.transaction.annotation.Transactional
    public MaintenanceLog closeMaintenance(Long id) {
        MaintenanceLog log = maintenanceLogRepository.findById(id)
                .orElseThrow(() -> new com.transitops.exception.ResourceNotFoundException("Maintenance log not found with ID: " + id));

        log.setStatus(MaintenanceLog.MaintenanceStatus.CLOSED);

        Vehicle vehicle = log.getVehicle();
        if (vehicle != null) {
            vehicle.setStatus(VehicleStatus.AVAILABLE);
            vehicleService.update(vehicle.getId(), vehicle);
        }

        return maintenanceLogRepository.save(log);
    }
}