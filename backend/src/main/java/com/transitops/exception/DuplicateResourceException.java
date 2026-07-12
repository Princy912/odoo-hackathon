package com.transitops.exception;

/** Thrown when a unique field (regNumber, licenseNumber, etc.) already exists. */
public class DuplicateResourceException extends RuntimeException {
    public DuplicateResourceException(String message) {
        super(message);
    }
}