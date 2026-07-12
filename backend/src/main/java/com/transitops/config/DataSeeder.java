package com.transitops.config;

import com.transitops.model.Role;
import com.transitops.model.User;
import com.transitops.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * Seeds initial data on application startup.
 *
 * <p>The seed only runs when the {@code users} table is completely empty, so it
 * is safe to leave this in production — it won't overwrite hand-crafted data
 * after the first deployment.
 */
@Slf4j
@Configuration
@RequiredArgsConstructor
public class DataSeeder {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    public CommandLineRunner seedAdminUser() {
        return args -> {
            if (userRepository.count() == 0) {
                User admin = User.builder()
                        .name("Admin")
                        .email("admin@transitops.com")
                        .passwordHash(passwordEncoder.encode("admin123"))
                        .role(Role.FLEET_MANAGER)
                        .build();

                userRepository.save(admin);
                log.info("✅  Seeded default FLEET_MANAGER user: admin@transitops.com");
            } else {
                log.info("ℹ️   Users table already populated — skipping seed.");
            }
        };
    }
}
