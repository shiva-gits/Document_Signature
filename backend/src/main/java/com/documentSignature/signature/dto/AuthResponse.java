package com.documentSignature.signature.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Reusable outbound authentication token payload
 * appending the role alongside the jwt client side dashboard to instantly
 * adjust layout views without needing to decode the cryptographic token
 * manually
 */

@Data
@AllArgsConstructor // Critical: this annotation automatically generates the authResponse(String,
                    // String) constructor
@NoArgsConstructor // good practice: generates the default empty constructor for jackson
                   // serialization
public class AuthResponse {
    private String token;

    /**
     * Mapped role context string emitted back to the client application
     */
    private String role;
}
