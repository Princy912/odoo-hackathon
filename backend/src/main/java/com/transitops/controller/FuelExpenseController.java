package com.transitops.controller;

import com.transitops.dto.ExpenseRequest;
import com.transitops.dto.FuelLogRequest;
import com.transitops.entity.Expense;
import com.transitops.entity.FuelLog;
import com.transitops.service.FuelExpenseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class FuelExpenseController {

    private final FuelExpenseService fuelExpenseService;

    @PostMapping("/api/fuel-logs")
    public ResponseEntity<FuelLog> createFuelLog(@Valid @RequestBody FuelLogRequest request) {
        FuelLog created = fuelExpenseService.createFuelLog(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("/api/fuel-logs")
    public ResponseEntity<List<FuelLog>> getFuelLogs(@RequestParam Long vehicleId) {
        return ResponseEntity.ok(fuelExpenseService.getFuelLogsByVehicle(vehicleId));
    }

    @PostMapping("/api/expenses")
    public ResponseEntity<Expense> createExpense(@Valid @RequestBody ExpenseRequest request) {
        Expense created = fuelExpenseService.createExpense(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("/api/expenses")
    public ResponseEntity<List<Expense>> getExpenses(@RequestParam Long vehicleId) {
        return ResponseEntity.ok(fuelExpenseService.getExpensesByVehicle(vehicleId));
    }
}