package com.documentSignature.signature.controller;

import com.documentSignature.signature.dto.LoginRequest;
import com.documentSignature.signature.dto.AuthResponse;
import com.documentSignature.signature.model.User;
import com.documentSignature.signature.repository.UserRepository;
import com.documentSignature.signature.security.JwtProvider;
import jakarta.validation.Valid;
import lombok.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor

public class LoginController {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            // 1. fetch user from DB
            User user = userRepository.findByEmail(loginRequest.getEmail())
                    .orElseThrow(() -> new RuntimeException("Error: Invalid Email or Password"));

            // 2. Varify hashed password matches incoming raw password
            if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Error: Invalid Email or Password");
            }

            // ----UPDATED: COMPLY WITH TWO-PARAMETERS GENERATETOKEN SIGNATURE ----
            // passes user.getRole().name() to embed it in the JWT claims payload

            // 3. Generate JWT token using JWTPRovider
            String jwt = jwtProvider.generateToken(user.getEmail(), user.getRole().name());

            // UPDATED: RETURN TOKEN + ROLE CONTEXT TO FRONTEND CLIENT
            // PASSES BOTH STRING TOKEN AND THE EXPLICIT ROLE NAME OUT TO YOUR CLIENT
            // FRAMEWORK

            // 4. Return token in the AuthResponse DTO
            return ResponseEntity.ok(new AuthResponse(jwt, user.getRole().name()));

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An unexpected error occured during Login!");
        }
    }

}
