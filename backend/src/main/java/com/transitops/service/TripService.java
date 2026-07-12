package com.transitops.service;

import com.transitops.dto.TripRequest;
import com.transitops.entity.Driver;
import com.transitops.entity.DriverStatus;
import com.transitops.entity.Trip;
import com.transitops.entity.Vehicle;
import com.transitops.entity.VehicleStatus;
import com.transitops.exception.BusinessRuleException;
import com.transitops.repository.DriverRepository;
import com.transitops.repository.TripRepository;
import com.transitops.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TripService {

    private final TripRepository tripRepository;
    private final VehicleRepository vehicleRepository;
    private final DriverRepository driverRepository;

    @Transactional
    public Trip createTrip(TripRequest request) {
        Vehicle vehicle = vehicleRepository.findById(request.getVehicleId())
                .orElseThrow(() -> new BusinessRuleException("Vehicle not found with ID: " + request.getVehicleId()));

        Driver driver = driverRepository.findById(request.getDriverId())
                .orElseThrow(() -> new BusinessRuleException("Driver not found with ID: " + request.getDriverId()));

        if (vehicle.getStatus() != VehicleStatus.AVAILABLE) {
            throw new BusinessRuleException("Vehicle must have status AVAILABLE (current: " + vehicle.getStatus() + ")");
        }

        if (driver.getStatus() != DriverStatus.AVAILABLE) {
            throw new BusinessRuleException("Driver must have status AVAILABLE (current: " + driver.getStatus() + ")");
        }

        if (driver.getLicenseExpiry() == null) {
            throw new BusinessRuleException("Driver has no license expiry date configured");
        }

        if (driver.getLicenseExpiry().isBefore(LocalDate.now())) {
            throw new BusinessRuleException("Driver's license is expired. Expiry date: " + driver.getLicenseExpiry());
        }

        if (vehicle.getMaxLoadCapacity() != null && request.getCargoWeight() > vehicle.getMaxLoadCapacity()) {
            throw new BusinessRuleException("Cargo weight (" + request.getCargoWeight() 
                    + ") exceeds vehicle's max load capacity (" + vehicle.getMaxLoadCapacity() + ")");
        }

        Trip trip = new Trip();
        trip.setSource(request.getSource());
        trip.setDestination(request.getDestination());
        trip.setVehicle(vehicle);
        trip.setDriver(driver);
        trip.setCargoWeight(request.getCargoWeight());
        trip.setPlannedDistance(request.getPlannedDistance());
        trip.setStatus(Trip.TripStatus.DRAFT);

        return tripRepository.save(trip);
    }

    @Transactional
    public Trip dispatch(Long tripId) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new BusinessRuleException("Trip not found with ID: " + tripId));

        if (trip.getStatus() != Trip.TripStatus.DRAFT) {
            throw new BusinessRuleException("Trip is not in DRAFT status (current status: " + trip.getStatus() + ")");
        }

        Vehicle vehicle = trip.getVehicle();
        if (vehicle != null) {
            vehicle.setStatus(VehicleStatus.ON_TRIP);
            vehicleRepository.save(vehicle);
        }

        Driver driver = trip.getDriver();
        if (driver != null) {
            driver.setStatus(DriverStatus.ON_TRIP);
            driverRepository.save(driver);
        }

        trip.setStatus(Trip.TripStatus.DISPATCHED);
        trip.setDispatchedAt(LocalDateTime.now());
        return tripRepository.save(trip);
    }

    @Transactional
    public Trip complete(Long tripId, Double actualDistance, Double fuelConsumed) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new BusinessRuleException("Trip not found with ID: " + tripId));

        if (trip.getStatus() != Trip.TripStatus.DISPATCHED) {
            throw new BusinessRuleException("Trip is not in DISPATCHED status (current status: " + trip.getStatus() + ")");
        }

        Vehicle vehicle = trip.getVehicle();
        if (vehicle != null) {
            vehicle.setStatus(VehicleStatus.AVAILABLE);
            vehicleRepository.save(vehicle);
        }

        Driver driver = trip.getDriver();
        if (driver != null) {
            driver.setStatus(DriverStatus.AVAILABLE);
            driverRepository.save(driver);
        }

        trip.setActualDistance(actualDistance);
        trip.setFuelConsumed(fuelConsumed);
        trip.setStatus(Trip.TripStatus.COMPLETED);
        trip.setCompletedAt(LocalDateTime.now());
        return tripRepository.save(trip);
    }

    @Transactional
    public Trip cancel(Long tripId) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new BusinessRuleException("Trip not found with ID: " + tripId));

        if (trip.getStatus() == Trip.TripStatus.DISPATCHED) {
            Vehicle vehicle = trip.getVehicle();
            if (vehicle != null) {
                vehicle.setStatus(VehicleStatus.AVAILABLE);
                vehicleRepository.save(vehicle);
            }

            Driver driver = trip.getDriver();
            if (driver != null) {
                driver.setStatus(DriverStatus.AVAILABLE);
                driverRepository.save(driver);
            }
        }

        trip.setStatus(Trip.TripStatus.CANCELLED);
        return tripRepository.save(trip);
    }

    @Transactional(readOnly = true)
    public List<Trip> getAllTrips() {
        return tripRepository.findAll();
    }

    @Transactional
    public Trip updateTrip(Long id, TripRequest request) {
        Trip trip = tripRepository.findById(id)
                .orElseThrow(() -> new BusinessRuleException("Trip not found with ID: " + id));

        if (trip.getStatus() != Trip.TripStatus.DRAFT) {
            throw new BusinessRuleException("Only DRAFT trips can be edited");
        }

        Vehicle vehicle = vehicleRepository.findById(request.getVehicleId())
                .orElseThrow(() -> new BusinessRuleException("Vehicle not found with ID: " + request.getVehicleId()));

        Driver driver = driverRepository.findById(request.getDriverId())
                .orElseThrow(() -> new BusinessRuleException("Driver not found with ID: " + request.getDriverId()));

        if (vehicle.getStatus() != VehicleStatus.AVAILABLE && (trip.getVehicle() == null || !vehicle.getId().equals(trip.getVehicle().getId()))) {
            throw new BusinessRuleException("Vehicle must have status AVAILABLE (current: " + vehicle.getStatus() + ")");
        }

        if (driver.getStatus() != DriverStatus.AVAILABLE && (trip.getDriver() == null || !driver.getId().equals(trip.getDriver().getId()))) {
            throw new BusinessRuleException("Driver must have status AVAILABLE (current: " + driver.getStatus() + ")");
        }

        if (driver.getLicenseExpiry() == null) {
            throw new BusinessRuleException("Driver has no license expiry date configured");
        }

        if (driver.getLicenseExpiry().isBefore(LocalDate.now())) {
            throw new BusinessRuleException("Driver's license is expired. Expiry date: " + driver.getLicenseExpiry());
        }

        if (vehicle.getMaxLoadCapacity() != null && request.getCargoWeight() > vehicle.getMaxLoadCapacity()) {
            throw new BusinessRuleException("Cargo weight (" + request.getCargoWeight() 
                    + ") exceeds vehicle's max load capacity (" + vehicle.getMaxLoadCapacity() + ")");
        }

        trip.setSource(request.getSource());
        trip.setDestination(request.getDestination());
        trip.setVehicle(vehicle);
        trip.setDriver(driver);
        trip.setCargoWeight(request.getCargoWeight());
        trip.setPlannedDistance(request.getPlannedDistance());

        return tripRepository.save(trip);
    }

    @Transactional
    public void deleteTrip(Long id) {
        Trip trip = tripRepository.findById(id)
                .orElseThrow(() -> new BusinessRuleException("Trip not found with ID: " + id));
        if (trip.getStatus() != Trip.TripStatus.DRAFT) {
            throw new BusinessRuleException("Only DRAFT trips can be deleted");
        }
        tripRepository.delete(trip);
    }
}
