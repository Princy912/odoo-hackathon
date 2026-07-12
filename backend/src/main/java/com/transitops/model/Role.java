package com.transitops.model;

/**
 * Application roles used for authorization decisions.
 * Stored as a VARCHAR in the `users` table.
 */
public enum Role {
    FLEET_MANAGER,
    DRIVER,
    SAFETY_OFFICER,
    FINANCIAL_ANALYST
}
