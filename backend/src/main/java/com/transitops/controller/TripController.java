package com.transitops.controller;

import com.transitops.dto.CompleteTripRequest;
import com.transitops.dto.TripRequest;
import com.transitops.entity.Trip;
import com.transitops.exception.BusinessRuleException;
import com.transitops.service.TripService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trips")
@RequiredArgsConstructor
public class TripController {

    private final TripService tripService;

    @GetMapping
    public ResponseEntity<List<Trip>> getAllTrips() {
        return ResponseEntity.ok(tripService.getAllTrips());
    }

    @PostMapping
    public ResponseEntity<Trip> createTrip(@Valid @RequestBody TripRequest request) {
        return ResponseEntity.ok(tripService.createTrip(request));
    }

    @PutMapping("/{id}/dispatch")
    public ResponseEntity<Trip> dispatchTrip(@PathVariable Long id) {
        return ResponseEntity.ok(tripService.dispatch(id));
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<Trip> completeTrip(
            @PathVariable Long id,
            @RequestBody(required = false) CompleteTripRequest body,
            @RequestParam(required = false) Double actualDistance,
            @RequestParam(required = false) Double fuelConsumed) {
        
        Double distance = (body != null && body.getActualDistance() != null) ? body.getActualDistance() : actualDistance;
        Double fuel = (body != null && body.getFuelConsumed() != null) ? body.getFuelConsumed() : fuelConsumed;

        if (distance == null || fuel == null) {
            throw new BusinessRuleException("Both actualDistance and fuelConsumed must be provided in the request body or parameters.");
        }

        return ResponseEntity.ok(tripService.complete(id, distance, fuel));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<Trip> cancelTrip(@PathVariable Long id) {
        return ResponseEntity.ok(tripService.cancel(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Trip> updateTrip(@PathVariable Long id, @Valid @RequestBody TripRequest request) {
        return ResponseEntity.ok(tripService.updateTrip(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTrip(@PathVariable Long id) {
        tripService.deleteTrip(id);
        return ResponseEntity.noContent().build();
    }
}
