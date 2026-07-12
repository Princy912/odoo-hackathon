package com.transitops.controller;

import com.transitops.service.DashboardService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    // GET /api/dashboard/kpis
    // Returns: { activeVehicles, availableVehicles, vehiclesInMaintenance,
    //            activeTrips, pendingTrips, driversOnDuty, fleetUtilization }
    @GetMapping("/kpis")
    public Map<String, Object> getKpis() {
        return dashboardService.getKpis();
    }
}