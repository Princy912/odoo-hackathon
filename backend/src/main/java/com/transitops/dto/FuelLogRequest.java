package com.transitops.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class FuelLogRequest {

    @NotNull
    private Long vehicleId;

    // Optional — a fuel log doesn't have to be tied to a specific trip
    private Long tripId;

    @NotNull
    @Positive
    private Double liters;

    @NotNull
    @Positive
    private BigDecimal cost;

    @NotNull
    private LocalDate logDate;
}