package com.transitops.repository;

import com.transitops.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Spring Data JPA repository for {@link User}.
 * Hibernate DDL will ensure the `users` table exists before any call is made.
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * Look up a user by their unique email address.
     *
     * @param email the email to search for
     * @return an {@link Optional} containing the user if found
     */
    Optional<User> findByEmail(String email);
}
