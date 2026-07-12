package com.transitops.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VehicleCostResponse {

    private Long vehicleId;
    private BigDecimal fuelCost;
    private BigDecimal maintenanceCost;
    private BigDecimal totalCost;
}