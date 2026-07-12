package com.transitops.service;

import com.transitops.entity.Vehicle;
import com.transitops.entity.VehicleStatus;
import com.transitops.entity.Driver;
import com.transitops.entity.DriverStatus;
import com.transitops.entity.Trip;
import com.transitops.repository.VehicleRepository;
import com.transitops.repository.DriverRepository;
import com.transitops.repository.TripRepository;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Aggregates dashboard KPI figures for GET /api/dashboard/kpis.
 *
 * Matches the real entities shipped in feature/vehicle-driver and
 * feature/trip-maintenance:
 * VehicleStatus (top-level enum) -> AVAILABLE, ON_TRIP, IN_SHOP, RETIRED
 * DriverStatus  (top-level enum) -> AVAILABLE, ON_TRIP, OFF_DUTY, SUSPENDED
 * Trip.TripStatus (nested enum)  -> DRAFT, DISPATCHED, COMPLETED, CANCELLED
 *
 * Counts are computed in-memory from findAll() rather than relying on a
 * countByStatus(...) repository method, since that method isn't guaranteed
 * to exist on VehicleRepository/DriverRepository.
 */
@Service
public class DashboardService {

    private final VehicleRepository vehicleRepository;
    private final DriverRepository driverRepository;
    private final TripRepository tripRepository;

    public DashboardService(VehicleRepository vehicleRepository,
                             DriverRepository driverRepository,
                             TripRepository tripRepository) {
        this.vehicleRepository = vehicleRepository;
        this.driverRepository = driverRepository;
        this.tripRepository = tripRepository;
    }

    public Map<String, Object> getKpis() {
        List<Vehicle> vehicles = vehicleRepository.findAll();
        List<Driver> drivers = driverRepository.findAll();
        List<Trip> trips = tripRepository.findAll();

        long totalVehicles = vehicles.size();
        long retiredVehicles = vehicles.stream()
                .filter(v -> v.getStatus() == VehicleStatus.RETIRED)
                .count();
        long availableVehicles = vehicles.stream()
                .filter(v -> v.getStatus() == VehicleStatus.AVAILABLE)
                .count();
        long onTripVehicles = vehicles.stream()
                .filter(v -> v.getStatus() == VehicleStatus.ON_TRIP)
                .count();
        long inShopVehicles = vehicles.stream()
                .filter(v -> v.getStatus() == VehicleStatus.IN_SHOP)
                .count();

        long nonRetiredVehicles = totalVehicles - retiredVehicles;
        long activeVehicles = nonRetiredVehicles; // in the operational pool, not retired

        long activeTrips = trips.stream()
                .filter(t -> t.getStatus() == Trip.TripStatus.DISPATCHED)
                .count();
        long pendingTrips = trips.stream()
                .filter(t -> t.getStatus() == Trip.TripStatus.DRAFT)
                .count();

        // "On duty" = currently working a shift, whether idle or mid-trip.
        long driversOnDuty = drivers.stream()
                .filter(d -> d.getStatus() == DriverStatus.AVAILABLE
                        || d.getStatus() == DriverStatus.ON_TRIP)
                .count();

        double fleetUtilization = nonRetiredVehicles == 0
                ? 0.0
                : (onTripVehicles * 100.0) / nonRetiredVehicles;

        Map<String, Object> kpis = new LinkedHashMap<>();
        kpis.put("activeVehicles", activeVehicles);
        kpis.put("availableVehicles", availableVehicles);
        kpis.put("vehiclesInMaintenance", inShopVehicles);
        kpis.put("activeTrips", activeTrips);
        kpis.put("pendingTrips", pendingTrips);
        kpis.put("driversOnDuty", driversOnDuty);
        kpis.put("fleetUtilization", Math.round(fleetUtilization * 10.0) / 10.0);

        return kpis;
    }
}