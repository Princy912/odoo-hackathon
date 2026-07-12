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

    @org.springframework.transaction.annotation.Transactional
    public MaintenanceLog updateMaintenance(Long id, MaintenanceRequest request) {
        MaintenanceLog log = maintenanceLogRepository.findById(id)
                .orElseThrow(() -> new com.transitops.exception.ResourceNotFoundException("Maintenance log not found with ID: " + id));

        Vehicle oldVehicle = log.getVehicle();
        Vehicle newVehicle = vehicleService.getById(request.getVehicleId());

        if (log.getStatus() == MaintenanceLog.MaintenanceStatus.ACTIVE) {
            if (oldVehicle != null && !oldVehicle.getId().equals(newVehicle.getId())) {
                oldVehicle.setStatus(VehicleStatus.AVAILABLE);
                vehicleService.update(oldVehicle.getId(), oldVehicle);

                newVehicle.setStatus(VehicleStatus.IN_SHOP);
                vehicleService.update(newVehicle.getId(), newVehicle);
            }
        }

        log.setVehicle(newVehicle);
        log.setType(request.getType());
        log.setCost(request.getCost());
        log.setServiceDate(request.getServiceDate());

        return maintenanceLogRepository.save(log);
    }

    @org.springframework.transaction.annotation.Transactional
    public void deleteMaintenance(Long id) {
        MaintenanceLog log = maintenanceLogRepository.findById(id)
                .orElseThrow(() -> new com.transitops.exception.ResourceNotFoundException("Maintenance log not found with ID: " + id));

        if (log.getStatus() == MaintenanceLog.MaintenanceStatus.ACTIVE) {
            Vehicle vehicle = log.getVehicle();
            if (vehicle != null) {
                vehicle.setStatus(VehicleStatus.AVAILABLE);
                vehicleService.update(vehicle.getId(), vehicle);
            }
        }

        maintenanceLogRepository.delete(log);
    }
}