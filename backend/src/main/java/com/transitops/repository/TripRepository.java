package com.transitops.repository;

import com.transitops.entity.Trip;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TripRepository extends JpaRepository<Trip, Long> {
    List<Trip> findByStatus(Trip.TripStatus status);
    List<Trip> findByVehicleIdAndStatus(Long vehicleId, Trip.TripStatus status);
}
