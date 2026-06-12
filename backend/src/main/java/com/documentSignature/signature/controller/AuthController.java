package com.documentSignature.signature.controller;

import com.documentSignature.signature.dto.AuthResponse;
import com.documentSignature.signature.dto.LoginRequest;
import com.documentSignature.signature.dto.RegisterRequest;
import com.documentSignature.signature.model.User;
import com.documentSignature.signature.repository.UserRepository;
import com.documentSignature.signature.security.JwtProvider;
import jakarta.validation.Valid;
import lombok.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;

    @PostMapping("/register")
    public ResponseEntity<?> registerUSer(@Valid @RequestBody RegisterRequest registerRequest) {
        // checking if the email is already taken
        if (userRepository.findByEmail(registerRequest.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Error: Email is already in Use!");
        }

        // 2. build a new user using the lombok builder pattern and hash the password
        User user = User.builder()
                .name(registerRequest.getName())
                .email(registerRequest.getEmail())
                .password(passwordEncoder.encode(registerRequest.getPassword())) // Bcrypt hashing
                .build();

        // 3. save the new user to the database
        userRepository.save(user);

        return ResponseEntity.ok("User Registered Successfully!");
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        // 1. Fetch user from the DB
        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("Error: Invalid Email or Password!"));

        // 2. Verify hashed password matches incoming raw password
        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            return ResponseEntity.badRequest().body("Error: Invalid Email or Password!");
        }

        // 3. Generate token useing your existing JwtProvider
        String jwt = jwtProvider.generateToken(user.getEmail());

        return ResponseEntity.ok(new AuthResponse(jwt));
    }
}
