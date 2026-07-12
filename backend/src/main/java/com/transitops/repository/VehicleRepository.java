package com.transitops.repository;

import com.transitops.entity.Vehicle;
import com.transitops.entity.VehicleStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface VehicleRepository extends JpaRepository<Vehicle, Long> {

    boolean existsByRegNumber(String regNumber);

    Optional<Vehicle> findByRegNumber(String regNumber);

    // Simple derived filters (kept for direct/individual use)
    List<Vehicle> findByStatus(VehicleStatus status);

    List<Vehicle> findByType(String type);

    List<Vehicle> findByRegion(String region);

    /**
     * Combined filter used by GET /api/vehicles?status=&type=&region=.
     * Any parameter left null is ignored (matches everything for that field).
     */
    @Query("SELECT v FROM Vehicle v WHERE " +
            "(:status IS NULL OR v.status = :status) AND " +
            "(:type IS NULL OR v.type = :type) AND " +
            "(:region IS NULL OR v.region = :region)")
    List<Vehicle> search(@Param("status") VehicleStatus status,
                          @Param("type") String type,
                          @Param("region") String region);
}
