package com.transitops.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "drivers")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Driver {

    @Id
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DriverStatus status;

    public enum DriverStatus {
        AVAILABLE,
        ON_TRIP,
        OFF_DUTY,
        SUSPENDED
    }
}
