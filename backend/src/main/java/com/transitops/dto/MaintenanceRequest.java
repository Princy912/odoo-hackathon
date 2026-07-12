package com.transitops.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class MaintenanceRequest {
    private Long vehicleId;
    private String type;
    private Double cost;
    private LocalDate serviceDate;
}