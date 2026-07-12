package com.transitops.security;

import com.transitops.model.Role;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

/**
 * Utility for creating and validating JJWT 0.12.x tokens.
 *
 * <p>Claims embedded in every token:
 * <ul>
 *   <li>{@code sub}  — user's email (standard JWT subject)</li>
 *   <li>{@code role} — serialised {@link Role} name</li>
 * </ul>
 */
@Component
public class JwtUtil {

    private final SecretKey signingKey;
    private final long expirationMs;

    public JwtUtil(
            @Value("${jwt.secret}") String secret,
            @Value("${jwt.expiration-ms}") long expirationMs) {
        // Derive a key from the configured secret string
        this.signingKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.expirationMs = expirationMs;
    }

    // ── Token generation ─────────────────────────────────────────────────────

    /**
     * Build a signed JWT for the given email and role.
     *
     * @param email user's email (becomes the {@code sub} claim)
     * @param role  user's role (stored as the {@code role} claim)
     * @return compact, URL-safe JWT string
     */
    public String generateToken(String email, Role role) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + expirationMs);

        return Jwts.builder()
                .subject(email)
                .claim("role", role.name())
                .issuedAt(now)
                .expiration(expiry)
                .signWith(signingKey)
                .compact();
    }

    // ── Token validation & extraction ────────────────────────────────────────

    /**
     * Parse and validate the token, returning its claims.
     *
     * @throws JwtException if the token is invalid or expired
     */
    private Claims parseClaims(String token) {
        return Jwts.parser()
                .verifyWith(signingKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    /**
     * Extract the email (subject) from a validated token.
     */
    public String extractEmail(String token) {
        return parseClaims(token).getSubject();
    }

    /**
     * Extract the role from a validated token.
     */
    public Role extractRole(String token) {
        String roleName = parseClaims(token).get("role", String.class);
        return Role.valueOf(roleName);
    }

    /**
     * Return {@code true} if the token signature is valid and the token is not expired.
     */
    public boolean isValid(String token) {
        try {
            parseClaims(token); // throws if invalid/expired
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }
}
