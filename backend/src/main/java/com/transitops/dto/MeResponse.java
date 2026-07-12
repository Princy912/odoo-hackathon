package com.transitops.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Response returned by the {@code GET /api/auth/me} endpoint.
 * Contains the authenticated user's profile details.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MeResponse {
    private String name;
    private String email;
    private String role;
}
