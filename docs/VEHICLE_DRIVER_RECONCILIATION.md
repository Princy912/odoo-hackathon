# Vehicle / Driver Reconciliation Notes
(for Member 3, when feature/vehicle-driver merges with feature/trip-maintenance — Phase 5)

Member 3 stubbed minimal `Vehicle` and `Driver` classes on `feature/trip-maintenance`
in Phase 1 (id + status only) just to get `Trip` and `MaintenanceLog` compiling.
This doc is the reconciliation checklist for when the real branches merge.

## 1. Delete Member 3's stubs
Delete these two files entirely from `feature/trip-maintenance`:
- `Vehicle.java` (stub)
- `Driver.java` (stub)

## 2. Import the canonical entities instead
Both live in `com.transitops.entity` (same package Member 3's stubs used, so no
import path changes needed elsewhere):
- `com.transitops.entity.Vehicle`
- `com.transitops.entity.VehicleStatus`
- `com.transitops.entity.Driver`
- `com.transitops.entity.DriverStatus`

## 3. Canonical field reference

**Vehicle**
| Field | Type |
|---|---|
| id | Long |
| regNumber | String (unique) |
| model | String |
| type | String |
| maxLoadCapacity | Double |
| odometer | Double |
| acquisitionCost | BigDecimal |
| region | String |
| status | VehicleStatus (AVAILABLE / ON_TRIP / IN_SHOP / RETIRED) |

**Driver**
| Field | Type |
|---|---|
| id | Long |
| name | String |
| licenseNumber | String (unique) |
| licenseCategory | String |
| licenseExpiry | LocalDate |
| contactNumber | String |
| safetyScore | Integer (default 100) |
| status | DriverStatus (AVAILABLE / ON_TRIP / OFF_DUTY / SUSPENDED) |

Both already carry Lombok `@Data` (getters/setters/equals/hashCode/toString
generated), so `vehicle.getStatus()`, `vehicle.setStatus(VehicleStatus.ON_TRIP)`,
`driver.getStatus()`, `driver.setStatus(DriverStatus.ON_TRIP)`, etc. all work
as-is in `TripService.dispatch()` / `.complete()` / `.cancel()`.

## 4. Things likely to break on recompile
- If the stub used a different enum name or plain `String status` instead of
  the typed enum, `TripService` logic comparing `status == "AVAILABLE"` needs
  to change to `status == VehicleStatus.AVAILABLE`.
- If the stub's field was named `registrationNumber` instead of `regNumber`,
  any reference needs renaming to match the canonical field above.
- `Trip`'s `@ManyToOne` relations to `Vehicle`/`Driver` don't need structural
  changes — only the import statement changes, the relation itself stays
  `@ManyToOne private Vehicle vehicle;` / `@ManyToOne private Driver driver;`.

## 5. Verification after reconciling
1. `mvn clean compile` — confirm no unresolved references.
2. `mvn spring-boot:run` — confirm Hibernate creates `trips` and
   `maintenance_logs` tables referencing `vehicles`/`drivers` via foreign key,
   no bean/mapping errors on boot.
3. Smoke test end-to-end: `POST /api/vehicles`, `POST /api/drivers`, then
   `POST /api/trips` referencing their real ids — confirm it saves instead of
   404/500ing on a bad reference.