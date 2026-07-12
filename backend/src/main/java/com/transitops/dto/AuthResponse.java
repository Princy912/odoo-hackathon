package com.transitops.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * Response body returned by both {@code /api/auth/register} and {@code /api/auth/login}.
 * Contains the signed JWT and the user's role so the frontend can make routing decisions
 * without decoding the token itself.
 */
@Data
@AllArgsConstructor
public class AuthResponse {

    private String token;
    private String role;
    private String email;
}
