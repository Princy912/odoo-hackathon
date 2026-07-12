package com.transitops.service;

import com.transitops.entity.*;
import com.transitops.repository.*;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final VehicleRepository vehicleRepository;
    private final FuelLogRepository fuelLogRepository;
    private final MaintenanceLogRepository maintenanceLogRepository;
    private final TripRepository tripRepository;

    // ASSUMPTION: Simple placeholder flat rate of $2.50 per km to calculate revenue
    private static final double FLAT_RATE_REVENUE_PER_KM = 2.50;

    @Data
    public static class ReportSummaryResponse {
        private List<VehicleSummary> vehicleReports = new ArrayList<>();
        private List<FuelEfficiencyPoint> fuelEfficiencyOverTime = new ArrayList<>();
    }

    @Data
    public static class VehicleSummary {
        private Long vehicleId;
        private String regNumber;
        private String model;
        private double fuelCost;
        private double maintenanceCost;
        private double operationalCost;
        private double acquisitionCost;
        private double revenue;
        private double roi;
        private double fuelEfficiency;
    }

    @Data
    public static class FuelEfficiencyPoint {
        private Long tripId;
        private String date;
        private String vehicleReg;
        private double efficiency; // actualDistance / fuelConsumed
    }

    public ReportSummaryResponse getSummary() {
        ReportSummaryResponse response = new ReportSummaryResponse();

        // 1. Gather vehicle metrics
        List<Vehicle> vehicles = vehicleRepository.findAll();
        for (Vehicle vehicle : vehicles) {
            VehicleSummary summary = new VehicleSummary();
            summary.setVehicleId(vehicle.getId());
            summary.setRegNumber(vehicle.getRegNumber());
            summary.setModel(vehicle.getModel());
            summary.setAcquisitionCost(vehicle.getAcquisitionCost() != null ? vehicle.getAcquisitionCost() : 0.0);

            // Sum fuel cost
            BigDecimal fuelSum = fuelLogRepository.sumCostByVehicleId(vehicle.getId());
            double fuelCost = fuelSum != null ? fuelSum.doubleValue() : 0.0;
            summary.setFuelCost(fuelCost);

            // Sum maintenance cost
            List<MaintenanceLog> maintLogs = maintenanceLogRepository.findByVehicleId(vehicle.getId());
            double maintenanceCost = maintLogs.stream()
                    .mapToDouble(m -> m.getCost() != null ? m.getCost() : 0.0)
                    .sum();
            summary.setMaintenanceCost(maintenanceCost);

            summary.setOperationalCost(fuelCost + maintenanceCost);

            // Calculate revenue and fuel efficiency using completed trips
            List<Trip> completedTrips = tripRepository.findByVehicleIdAndStatus(vehicle.getId(), Trip.TripStatus.COMPLETED);
            double revenue = completedTrips.stream()
                    .filter(t -> t.getActualDistance() != null)
                    .mapToDouble(t -> t.getActualDistance() * FLAT_RATE_REVENUE_PER_KM)
                    .sum();
            summary.setRevenue(revenue);

            double totalDistance = completedTrips.stream()
                    .filter(t -> t.getActualDistance() != null)
                    .mapToDouble(Trip::getActualDistance)
                    .sum();
            double totalFuel = completedTrips.stream()
                    .filter(t -> t.getFuelConsumed() != null)
                    .mapToDouble(Trip::getFuelConsumed)
                    .sum();
            summary.setFuelEfficiency(totalFuel > 0 ? totalDistance / totalFuel : 0.0);

            // ROI = (revenue - (maintenance + fuel)) / acquisitionCost
            double profit = revenue - summary.getOperationalCost();
            double roi = summary.getAcquisitionCost() > 0 ? (profit / summary.getAcquisitionCost()) * 100 : 0.0;
            summary.setRoi(roi);

            response.getVehicleReports().add(summary);
        }

        // 2. Gather fuel efficiency over time
        List<Trip> trips = tripRepository.findByStatus(Trip.TripStatus.COMPLETED);
        
        // Sort trips chronologically by completion time
        trips.sort(Comparator.comparing(t -> t.getCompletedAt() != null ? t.getCompletedAt() : t.getCreatedAt()));

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        for (Trip trip : trips) {
            if (trip.getActualDistance() != null && trip.getFuelConsumed() != null && trip.getFuelConsumed() > 0) {
                FuelEfficiencyPoint point = new FuelEfficiencyPoint();
                point.setTripId(trip.getId());
                
                String dateStr = "";
                if (trip.getCompletedAt() != null) {
                    dateStr = trip.getCompletedAt().format(formatter);
                } else if (trip.getCreatedAt() != null) {
                    dateStr = trip.getCreatedAt().format(formatter);
                }
                point.setDate(dateStr);
                point.setVehicleReg(trip.getVehicle() != null ? trip.getVehicle().getRegNumber() : "N/A");
                
                double efficiency = trip.getActualDistance() / trip.getFuelConsumed();
                point.setEfficiency(efficiency);

                response.getFuelEfficiencyOverTime().add(point);
            }
        }

        return response;
    }

    public String exportVehicleSummaryCsv() {
        ReportSummaryResponse summary = getSummary();
        StringBuilder csv = new StringBuilder();
        
        // Header
        csv.append("Vehicle ID,Registration Number,Model,Operational Cost ($),Fuel Efficiency (km/L),ROI (%)\n");
        
        for (VehicleSummary vs : summary.getVehicleReports()) {
            csv.append(vs.getVehicleId()).append(",")
               .append(vs.getRegNumber()).append(",")
               .append(vs.getModel().replace(",", " ")).append(",")
               .append(String.format("%.2f", vs.getOperationalCost())).append(",")
               .append(String.format("%.2f", vs.getFuelEfficiency())).append(",")
               .append(String.format("%.2f", vs.getRoi())).append("\n");
        }
        
        return csv.toString();
    }
}
