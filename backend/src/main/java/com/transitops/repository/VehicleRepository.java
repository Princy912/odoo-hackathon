package com.transitops.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.transitops.entity.Vehicle;
import com.transitops.entity.VehicleStatus;

public interface VehicleRepository extends JpaRepository<Vehicle, Long> {

    boolean existsByRegNumber(String regNumber);

    List<Vehicle> findByStatus(VehicleStatus status);

    List<Vehicle> findByType(String type);

    List<Vehicle> findByRegion(String region);

    /**
     * Phase 1: filter by status/type/region.
     * Phase 4: search by regNumber or model (?search=).
     * Any combination of params may be null - null means "don't filter on this field".
     */
    @Query("SELECT v FROM Vehicle v WHERE "
            + "(:status IS NULL OR v.status = :status) AND "
            + "(:type IS NULL OR v.type = :type) AND "
            + "(:region IS NULL OR v.region = :region) AND "
            + "(:search IS NULL OR LOWER(v.regNumber) LIKE LOWER(CONCAT('%', :search, '%')) "
            + "OR LOWER(v.model) LIKE LOWER(CONCAT('%', :search, '%')))")
    List<Vehicle> search(
            @Param("status") VehicleStatus status,
            @Param("type") String type,
            @Param("region") String region,
            @Param("search") String search);
}