# TransitOps Authentication & Authorization

This document outlines the authentication and authorization design of TransitOps and guides developers on how to secure endpoints.

---

## Architecture Overview

TransitOps uses a stateless **JSON Web Token (JWT)** authentication mechanism.

1. **Authentication Flow**:
   * Users register at `POST /api/auth/register` (passwords are hashed with BCrypt) or log in at `POST /api/auth/login`.
   * A successful login/registration returns a JWT token containing standard claims (`sub` = email, and `role` = user role).
2. **Filter Interception**:
   * The `JwtAuthFilter` intercepts incoming requests, reads the `Authorization: Bearer <token>` header, parses and validates the JWT, and loads the user's role authority into Spring Security's context.
   * To play nicely with Spring Security's defaults, the filter prefixes the role with `ROLE_` (e.g., `DRIVER` becomes `ROLE_DRIVER`).

---

## Getting Current User Profile

The system exposes a profile endpoint:
* **GET `/api/auth/me`** — Returns the authenticated user's `name`, `email`, and `role` matching the parsed JWT. Requires a valid JWT token.

---

## How to Protect Endpoints

### 1. Annotation-Based Access Control (Recommended)
We have enabled `@EnableMethodSecurity` in `SecurityConfig`. You can annotate any REST controller class or handler method with `@PreAuthorize` to restrict access.

> [!IMPORTANT]
> The `hasRole('ROLE_NAME')` expression matches the authority name without the `ROLE_` prefix. Under the hood, Spring Security appends `ROLE_` automatically.

#### Example: Restricting to Fleet Managers only
```java
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/vehicles")
public class VehicleController {

    @PostMapping
    @PreAuthorize("hasRole('FLEET_MANAGER')")
    public ResponseEntity<Vehicle> create(@RequestBody Vehicle vehicle) {
        // Only clients with the FLEET_MANAGER role can execute this method.
    }
}
```

#### Example: Restricting to multiple roles
To permit either a safety officer or a fleet manager to view safety reports:
```java
@GetMapping("/safety-reports")
@PreAuthorize("hasAnyRole('FLEET_MANAGER', 'SAFETY_OFFICER')")
public ResponseEntity<List<Report>> getReports() {
    // Both roles are authorized.
}
```

---

### 2. Manual Role Check via SecurityContextHolder

If you need finer-grained logic inside a service method (for example, comparing an resource owner's ID with the current user), you can query the `SecurityContext` manually.

#### Example: Checking programmatically
```java
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

public void updateDriverStatus(String driverEmail) {
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    String currentEmail = auth.getName(); // Extracts the authenticated email
    
    boolean isFleetManager = auth.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_FLEET_MANAGER"));
    
    // Allow the change only if the user is a FLEET_MANAGER, OR if the DRIVER is editing their own status
    if (!isFleetManager && !currentEmail.equals(driverEmail)) {
         throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You are not authorized to update this status.");
    }
}
```

---

### Available Roles in System

Refer to the `Role` enum when securing endpoints:
* `FLEET_MANAGER`
* `DRIVER`
* `SAFETY_OFFICER`
* `FINANCIAL_ANALYST`
