package com.documentSignature.signature.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

/**
 * Reusable data transfer object capturing incoming signup payloads
 * added the 'role' boundary field to accomodate syste authorization tiers.
 */

@Data
public class RegisterRequest {
    @NotBlank(message = "Name is required")
    @Size(max = 50)
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    @Size(max = 50)
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, max = 120) // Minimum password length check
    private String password;

    /**
     * input tracking variables for role identification.
     * expecting standard input words from clients(e.g. signer, validator, witness)
     * normalization to application enum types occures entirely inside the
     * processsing service layer
     */

    @NotBlank(message = "Role specification is mandatory!")
    private String role;
}
