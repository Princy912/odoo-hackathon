package com.transitops.service;

import com.transitops.dto.ExpenseRequest;
import com.transitops.dto.FuelLogRequest;
import com.transitops.entity.Expense;
import com.transitops.entity.FuelLog;
import com.transitops.entity.Trip;
import com.transitops.entity.Vehicle;
import com.transitops.exception.BusinessRuleException; // from Member 3's feature/trip-maintenance branch
import com.transitops.repository.ExpenseRepository;
import com.transitops.repository.FuelLogRepository;
import com.transitops.repository.TripRepository;
import com.transitops.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FuelExpenseService {

    private final FuelLogRepository fuelLogRepository;
    private final ExpenseRepository expenseRepository;
    private final VehicleRepository vehicleRepository;
    private final TripRepository tripRepository;

    public FuelLog createFuelLog(FuelLogRequest request) {
        Vehicle vehicle = vehicleRepository.findById(request.getVehicleId())
                .orElseThrow(() -> new BusinessRuleException("Vehicle not found: " + request.getVehicleId()));

        Trip trip = null;
        if (request.getTripId() != null) {
            trip = tripRepository.findById(request.getTripId())
                    .orElseThrow(() -> new BusinessRuleException("Trip not found: " + request.getTripId()));
        }

        FuelLog fuelLog = new FuelLog();
        fuelLog.setVehicle(vehicle);
        fuelLog.setTrip(trip);
        fuelLog.setLiters(request.getLiters());
        fuelLog.setCost(request.getCost());
        fuelLog.setLogDate(request.getLogDate());

        return fuelLogRepository.save(fuelLog);
    }

    public Expense createExpense(ExpenseRequest request) {
        Vehicle vehicle = vehicleRepository.findById(request.getVehicleId())
                .orElseThrow(() -> new BusinessRuleException("Vehicle not found: " + request.getVehicleId()));

        Expense expense = new Expense();
        expense.setVehicle(vehicle);
        expense.setCategory(request.getCategory());
        expense.setAmount(request.getAmount());
        expense.setExpenseDate(request.getExpenseDate());
        expense.setNote(request.getNote());

        return expenseRepository.save(expense);
    }

    public List<FuelLog> getFuelLogsByVehicle(Long vehicleId) {
        return fuelLogRepository.findByVehicleId(vehicleId);
    }

    public List<Expense> getExpensesByVehicle(Long vehicleId) {
        return expenseRepository.findByVehicleId(vehicleId);
    }
}