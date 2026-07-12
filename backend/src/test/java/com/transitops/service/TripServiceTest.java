package com.transitops.service;

import com.transitops.dto.TripRequest;
import com.transitops.entity.Driver;
import com.transitops.entity.Trip;
import com.transitops.entity.Vehicle;
import com.transitops.exception.BusinessRuleException;
import com.transitops.repository.DriverRepository;
import com.transitops.repository.TripRepository;
import com.transitops.repository.VehicleRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TripServiceTest {

    @Mock
    private TripRepository tripRepository;

    @Mock
    private VehicleRepository vehicleRepository;

    @Mock
    private DriverRepository driverRepository;

    @InjectMocks
    private TripService tripService;

    private Vehicle vehicle;
    private Driver driver;
    private TripRequest request;

    @BeforeEach
    void setUp() {
        vehicle = new Vehicle();
        vehicle.setId(1L);
        vehicle.setStatus(Vehicle.VehicleStatus.AVAILABLE);
        vehicle.setMaxLoadCapacity(1000.0);

        driver = new Driver();
        driver.setId(1L);
        driver.setStatus(Driver.DriverStatus.AVAILABLE);
        driver.setLicenseExpiry(LocalDate.now().plusDays(10));

        request = new TripRequest();
        request.setVehicleId(1L);
        request.setDriverId(1L);
        request.setCargoWeight(500.0);
        request.setPlannedDistance(100.0);
        request.setSource("A");
        request.setDestination("B");
    }

    @Test
    void createTrip_Success() {
        when(vehicleRepository.findById(1L)).thenReturn(Optional.of(vehicle));
        when(driverRepository.findById(1L)).thenReturn(Optional.of(driver));
        when(tripRepository.save(any(Trip.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Trip trip = tripService.createTrip(request);

        assertNotNull(trip);
        assertEquals(Trip.TripStatus.DRAFT, trip.getStatus());
        assertEquals("A", trip.getSource());
        assertEquals("B", trip.getDestination());
        assertEquals(vehicle, trip.getVehicle());
        assertEquals(driver, trip.getDriver());
    }

    @Test
    void createTrip_VehicleNotAvailable_ThrowsException() {
        vehicle.setStatus(Vehicle.VehicleStatus.ON_TRIP);
        when(vehicleRepository.findById(1L)).thenReturn(Optional.of(vehicle));
        when(driverRepository.findById(1L)).thenReturn(Optional.of(driver));

        BusinessRuleException exception = assertThrows(BusinessRuleException.class, () -> {
            tripService.createTrip(request);
        });

        assertTrue(exception.getMessage().contains("Vehicle must have status AVAILABLE"));
    }

    @Test
    void createTrip_DriverNotAvailable_ThrowsException() {
        driver.setStatus(Driver.DriverStatus.SUSPENDED);
        when(vehicleRepository.findById(1L)).thenReturn(Optional.of(vehicle));
        when(driverRepository.findById(1L)).thenReturn(Optional.of(driver));

        BusinessRuleException exception = assertThrows(BusinessRuleException.class, () -> {
            tripService.createTrip(request);
        });

        assertTrue(exception.getMessage().contains("Driver must have status AVAILABLE"));
    }

    @Test
    void createTrip_DriverLicenseExpired_ThrowsException() {
        driver.setLicenseExpiry(LocalDate.now().minusDays(1));
        when(vehicleRepository.findById(1L)).thenReturn(Optional.of(vehicle));
        when(driverRepository.findById(1L)).thenReturn(Optional.of(driver));

        BusinessRuleException exception = assertThrows(BusinessRuleException.class, () -> {
            tripService.createTrip(request);
        });

        assertTrue(exception.getMessage().contains("Driver's license is expired"));
    }

    @Test
    void createTrip_CargoWeightExceedsCapacity_ThrowsException() {
        request.setCargoWeight(1500.0);
        when(vehicleRepository.findById(1L)).thenReturn(Optional.of(vehicle));
        when(driverRepository.findById(1L)).thenReturn(Optional.of(driver));

        BusinessRuleException exception = assertThrows(BusinessRuleException.class, () -> {
            tripService.createTrip(request);
        });

        assertTrue(exception.getMessage().contains("exceeds vehicle's max load capacity"));
    }

    @Test
    void dispatch_Success() {
        Trip trip = new Trip();
        trip.setId(10L);
        trip.setStatus(Trip.TripStatus.DRAFT);
        trip.setVehicle(vehicle);
        trip.setDriver(driver);

        when(tripRepository.findById(10L)).thenReturn(Optional.of(trip));
        when(tripRepository.save(any(Trip.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Trip result = tripService.dispatch(10L);

        assertNotNull(result);
        assertEquals(Trip.TripStatus.DISPATCHED, result.getStatus());
        assertNotNull(result.getDispatchedAt());
        assertEquals(Vehicle.VehicleStatus.ON_TRIP, vehicle.getStatus());
        assertEquals(Driver.DriverStatus.ON_TRIP, driver.getStatus());
        verify(vehicleRepository).save(vehicle);
        verify(driverRepository).save(driver);
    }

    @Test
    void dispatch_NotDraft_ThrowsException() {
        Trip trip = new Trip();
        trip.setId(10L);
        trip.setStatus(Trip.TripStatus.DISPATCHED);

        when(tripRepository.findById(10L)).thenReturn(Optional.of(trip));

        BusinessRuleException exception = assertThrows(BusinessRuleException.class, () -> {
            tripService.dispatch(10L);
        });

        assertTrue(exception.getMessage().contains("Trip is not in DRAFT status"));
    }

    @Test
    void complete_Success() {
        Trip trip = new Trip();
        trip.setId(10L);
        trip.setStatus(Trip.TripStatus.DISPATCHED);
        trip.setVehicle(vehicle);
        trip.setDriver(driver);

        when(tripRepository.findById(10L)).thenReturn(Optional.of(trip));
        when(tripRepository.save(any(Trip.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Trip result = tripService.complete(10L, 120.5, 15.0);

        assertNotNull(result);
        assertEquals(Trip.TripStatus.COMPLETED, result.getStatus());
        assertEquals(120.5, result.getActualDistance());
        assertEquals(15.0, result.getFuelConsumed());
        assertNotNull(result.getCompletedAt());
        assertEquals(Vehicle.VehicleStatus.AVAILABLE, vehicle.getStatus());
        assertEquals(Driver.DriverStatus.AVAILABLE, driver.getStatus());
        verify(vehicleRepository).save(vehicle);
        verify(driverRepository).save(driver);
    }

    @Test
    void cancel_DispatchedTrip_ResetsStatus() {
        Trip trip = new Trip();
        trip.setId(10L);
        trip.setStatus(Trip.TripStatus.DISPATCHED);
        trip.setVehicle(vehicle);
        trip.setDriver(driver);

        when(tripRepository.findById(10L)).thenReturn(Optional.of(trip));
        when(tripRepository.save(any(Trip.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Trip result = tripService.cancel(10L);

        assertNotNull(result);
        assertEquals(Trip.TripStatus.CANCELLED, result.getStatus());
        assertEquals(Vehicle.VehicleStatus.AVAILABLE, vehicle.getStatus());
        assertEquals(Driver.DriverStatus.AVAILABLE, driver.getStatus());
        verify(vehicleRepository).save(vehicle);
        verify(driverRepository).save(driver);
    }
}
