package com.documentSignature.signature.model;

/**
 * Enumeration representing user security roles within the application.
 * Using ROLE_ prefix allows spring security's default role-voter mechanics
 * to parse and evaluate access expressions seamlessly without custom prefix
 * configurations.
 */

public enum Role {
    ROLE_SIGNER, // Limited access: can read assigned docs and append signatures
    ROLE_WITNESS, // Limited access: acts purely as an attesting third party on signature cycles
    ROLE_VALIDATOR // Administrative access: complete oversight, can delete, review or authorize
                   // docs
}
