# TransitOps Monorepo Merge Conflict & Package Structure Checklist

This checklist is for all team members (Member 2, Member 3, etc.) to run through before and after merging their respective feature branches (`feature/vehicle-driver`, `feature/trip-maintenance`, etc.) into `main`.

---

## 1. Package Structure Consistency
Ensure all new code follows the standardized Spring Boot package layout. Do not create custom root packages.

* [ ] **Controllers**: Must reside in `com.transitops.controller`
* [ ] **Services**: Must reside in `com.transitops.service`
* [ ] **Entities**: Must reside in `com.transitops.entity` (with the exception of auth-related `User`/`Role` which live in `com.transitops.model`)
* [ ] **Repositories**: Must reside in `com.transitops.repository`
* [ ] **DTOs**: Must reside in `com.transitops.dto`
* [ ] **Exception Handlers**: Must reside in `com.transitops.exception`

---

## 2. Vehicle & Driver Entity Alignment (Crucial)
During initial development phases, **Member 3** (Trips & Maintenance) used stubbed definitions of `Vehicle` and `Driver` to avoid build blockers. **Member 2** (Vehicle & Driver management) built the real database models.

Before merging, **Member 3** must delete their stubbed classes and replace them with imports of Member 2's classes. Check that the field names align:

### Vehicle Fields (`com.transitops.entity.Vehicle`)
* [ ] **Registration Number**: Must be `regNumber` (camelCase), mapped to `@Column(name = "reg_number")`. Do not use `registrationNumber` or `licensePlate`.
* [ ] **Capacity**: Must be `maxLoadCapacity` (Double).
* [ ] **Status**: Must use the `VehicleStatus` enum (`AVAILABLE`, `IN_SHOP`, `ON_TRIP`, `RETIRED`). Do not use raw strings or integer ordinals.
* [ ] **Cost**: Must be `acquisitionCost` (`BigDecimal`).

### Driver Fields (`com.transitops.entity.Driver`)
* [ ] **Name**: Must be `name` (String).
* [ ] **License Number**: Must be `licenseNumber` (String).
* [ ] **Status**: Must use the `DriverStatus` enum (`AVAILABLE`, `ON_TRIP`, `ON_LEAVE`, `INACTIVE`).

---

## 3. Database Schema Verification (DDL)
* [ ] Confirm that `spring.jpa.hibernate.ddl-auto=update` in `application.properties` cleanly updates the table structures for MySQL without dropping tables or throwing grammar/syntax exceptions.
* [ ] Verify that enum values in Java code exactly match the string enums generated in MySQL database definitions.

---

## 4. API Endpoint Security
* [ ] Ensure all controllers utilize method-level annotations (like `@PreAuthorize("hasRole('ROLE_NAME')")`) to enforce role-based access control (see details in [docs/AUTH.md](file:///Users/princy/Desktop/transitops/docs/AUTH.md)).
* [ ] Confirm that your local tests are executed with valid Authorization Bearer tokens in headers.
