package com.documentSignature.signature.controller;

import com.documentSignature.signature.dto.RegisterRequest;
import com.documentSignature.signature.model.Role;
import com.documentSignature.signature.model.User;
import com.documentSignature.signature.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor

public class RegistrationController {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest registerRequest) {
        try {
            // 1. checking if the user email is already taken
            if (userRepository.findByEmail(registerRequest.getEmail()).isPresent()) {
                return ResponseEntity.badRequest().body("Error: Email is already in Use!");

            }

            // -----UPDATED ROLE PARSING CONVERSION BLOCK ----

            Role assignedRole;
            try {
                // takes "signer", "witness", and "validator", sanitizes it and maps to the enum
                // format ("ROLE_SIGNER")
                assignedRole = Role.valueOf("ROLE_" + registerRequest.getRole().trim().toUpperCase());
            } catch (IllegalArgumentException | NullPointerException e) {
                // fires automatically if the incoming string doesn't match your exact defined
                // system enum variations
                return ResponseEntity.badRequest()
                        .body("Error: Invalid role option specified! choose signer, witness or validator!");
            }
            // 2. build a new user record mapping the parsed enum property
            User user = User.builder()
                    .name(registerRequest.getName())
                    .email(registerRequest.getEmail())
                    .password(passwordEncoder.encode(registerRequest.getPassword()))
                    .role(assignedRole) // persist the mapped role type configuration
                    .build();

            // 3. save the new user info to the DB
            userRepository.save(user);

            return ResponseEntity.status(HttpStatus.CREATED).body("User Registered Successfully!");
        } catch (Exception e) {
            // log the exception in the production e.g. logger.error("Registration Failed",
            // e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An Unexpected error occured during the registration!!: " + e.getMessage());
        }
    }
}
