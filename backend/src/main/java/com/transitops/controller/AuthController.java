package com.transitops.controller;

import com.transitops.dto.AuthResponse;
import com.transitops.dto.LoginRequest;
import com.transitops.dto.RegisterRequest;
import com.transitops.model.Role;
import com.transitops.model.User;
import com.transitops.repository.UserRepository;
import com.transitops.security.JwtUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

/**
 * REST controller that handles user registration and login.
 *
 * <p>Both endpoints are publicly accessible (see SecurityConfig).
 * On success they return a signed JWT together with the user's role
 * so the frontend can make role-based routing decisions immediately.
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    // ── POST /api/auth/register ───────────────────────────────────────────────

    /**
     * Create a new user account.
     *
     * <p>Request body fields:
     * <ul>
     *   <li>{@code name}  — display name (required)</li>
     *   <li>{@code email} — unique email (required)</li>
     *   <li>{@code password} — plain-text password, BCrypt-hashed before storage</li>
     *   <li>{@code role}  — optional; defaults to {@link Role#DRIVER} if omitted</li>
     * </ul>
     *
     * @return 201 Created with {@link AuthResponse} (token + role + email)
     */
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest req) {

        // Reject duplicate emails early with a meaningful message
        if (userRepository.findByEmail(req.getEmail()).isPresent()) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT, "Email already registered: " + req.getEmail());
        }

        // Parse the role string; fall back to DRIVER if missing or unrecognised
        Role role;
        try {
            role = (req.getRole() != null && !req.getRole().isBlank())
                    ? Role.valueOf(req.getRole().toUpperCase())
                    : Role.DRIVER;
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Invalid role: " + req.getRole());
        }

        User user = User.builder()
                .name(req.getName())
                .email(req.getEmail())
                .passwordHash(passwordEncoder.encode(req.getPassword()))
                .role(role)
                .build();

        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole());
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(new AuthResponse(token, role.name(), user.getEmail()));
    }

    // ── POST /api/auth/login ──────────────────────────────────────────────────

    /**
     * Authenticate with email + password and receive a JWT.
     *
     * @return 200 OK with {@link AuthResponse} (token + role + email)
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest req) {

        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED, "Invalid email or password"));

        if (!passwordEncoder.matches(req.getPassword(), user.getPasswordHash())) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED, "Invalid email or password");
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole());
        return ResponseEntity.ok(
                new AuthResponse(token, user.getRole().name(), user.getEmail()));
    }

    // ── GET /api/auth/me ──────────────────────────────────────────────────────

    /**
     * Retrieve the currently authenticated user's profile details.
     *
     * <p>Requires a valid JWT token in the Authorization header.
     *
     * @param principal the authenticated principal containing the email
     * @return 200 OK with {@link MeResponse}
     */
    @GetMapping("/me")
    public ResponseEntity<com.transitops.dto.MeResponse> getMe(java.security.Principal principal) {
        if (principal == null) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED, "User is not authenticated");
        }

        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "User not found"));

        return ResponseEntity.ok(com.transitops.dto.MeResponse.builder()
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .build());
    }
}
