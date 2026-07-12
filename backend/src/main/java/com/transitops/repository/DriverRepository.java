package com.transitops.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.transitops.entity.Driver;
import com.transitops.entity.DriverStatus;

public interface DriverRepository extends JpaRepository<Driver, Long> {

    boolean existsByLicenseNumber(String licenseNumber);

    List<Driver> findByStatus(DriverStatus status);

    /**
     * Phase 1: filter by status.
     * Phase 4: search by name or licenseNumber (?search=).
     */
    @Query("SELECT d FROM Driver d WHERE "
            + "(:status IS NULL OR d.status = :status) AND "
            + "(:search IS NULL OR LOWER(d.name) LIKE LOWER(CONCAT('%', :search, '%')) "
            + "OR LOWER(d.licenseNumber) LIKE LOWER(CONCAT('%', :search, '%')))")
    List<Driver> search(
            @Param("status") DriverStatus status,
            @Param("search") String search);
}