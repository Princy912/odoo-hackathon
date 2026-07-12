package com.transitops.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/trips")
public class TripController {

    @GetMapping
    public ResponseEntity<String> getAllTrips() {
        return ResponseEntity.ok("Trip placeholder endpoint");
    }

    @PostMapping
    public ResponseEntity<String> createTrip() {
        return ResponseEntity.ok("Create trip placeholder endpoint");
    }
}
