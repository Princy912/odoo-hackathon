package com.transitops.exception;

/**
 * Thrown when a create/update would violate a uniqueness rule
 * (e.g. duplicate vehicle regNumber or driver licenseNumber).
 */
public class DuplicateResourceException extends RuntimeException {
    public DuplicateResourceException(String message) {
        super(message);
    }
}
