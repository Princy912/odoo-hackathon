package com.transitops.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * Vehicle entity — owned by Member 2 (feature/vehicle-driver).
 * NOTE: Member 3 stubs a minimal version of this class on feature/trip-maintenance
 * for the Trip/MaintenanceLog relations. On merge (Phase 3), Member 3's stub
 * must be deleted and replaced with an import of THIS class. Field names below
 * (regNumber, status, etc.) are the source of truth — align Member 3's code to these.
 */
@Entity
@Table(name = "vehicles")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "reg_number", nullable = false, unique = true)
    private String regNumber;

    private String model;

    private String type;

    @Column(name = "max_load_capacity")
    private Double maxLoadCapacity;

    private Double odometer;

    @Column(name = "acquisition_cost")
    private BigDecimal acquisitionCost;

    private String region;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private VehicleStatus status = VehicleStatus.AVAILABLE;
}
