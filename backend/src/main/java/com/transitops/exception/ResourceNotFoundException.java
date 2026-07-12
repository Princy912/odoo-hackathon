package com.transitops.exception;

/**
 * Thrown when a lookup by id (get/update/delete) finds nothing.
 */
public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}
