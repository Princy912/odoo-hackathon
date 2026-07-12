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
import java.time.LocalDate;

import java.time.LocalDate;

/**
 * Driver entity — owned by Member 2 (feature/vehicle-driver).
 * NOTE: Member 3 stubs a minimal version of this class on feature/trip-maintenance
 * for the Trip relation. On merge (Phase 3), Member 3's stub must be deleted and
 * replaced with an import of THIS class. Field names below (licenseNumber, status,
 * etc.) are the source of truth.
 */
@Entity
@Table(name = "drivers")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Driver {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(name = "license_number", nullable = false, unique = true)
    private String licenseNumber;

    @Column(name = "license_category")
    private String licenseCategory;

    @Column(name = "license_expiry")
    private LocalDate licenseExpiry;

    @Column(name = "contact_number")
    private String contactNumber;

    @Column(name = "safety_score")
    @Builder.Default
    private Integer safetyScore = 100;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private DriverStatus status = DriverStatus.AVAILABLE;
}
