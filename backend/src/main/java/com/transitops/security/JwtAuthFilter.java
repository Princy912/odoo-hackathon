package com.transitops.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

/**
 * Servlet filter that intercepts every request exactly once, reads the
 * {@code Authorization: Bearer <token>} header, validates the JWT, and
 * populates the {@link SecurityContextHolder} so that downstream filters and
 * controllers see an authenticated principal.
 *
 * <p>If the header is absent or the token is invalid the filter simply passes
 * the request through — Spring Security's own {@code ExceptionTranslationFilter}
 * will then return a 401 for protected routes.
 */
@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7); // strip "Bearer "

            if (jwtUtil.isValid(token)) {
                String email = jwtUtil.extractEmail(token);
                String role   = jwtUtil.extractRole(token).name();

                // Prefix with ROLE_ so Spring Security's hasRole() works correctly
                var authority = new SimpleGrantedAuthority("ROLE_" + role);
                var auth = new UsernamePasswordAuthenticationToken(
                        email, null, List.of(authority));

                SecurityContextHolder.getContext().setAuthentication(auth);
            }
        }

        filterChain.doFilter(request, response);
    }
}
