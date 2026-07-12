package com.transitops.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FuelEfficiencyResponse {

    private Long vehicleId;
    private Double totalDistance;   // sum of actualDistance across completed trips
    private Double totalLiters;     // sum of liters across all fuel logs
    private Double efficiency;      // distance per liter (0 if no fuel logged)
}