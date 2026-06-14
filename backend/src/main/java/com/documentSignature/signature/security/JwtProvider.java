package com.documentSignature.signature.security;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JwtProvider {
    @Value("${app.jwt.secret}")
    private String jwtSecret;

    @Value("${app.jwt.expiration-ms}")
    private long jwtExpirationMs;

    // Generates a token using the user's email
    public String generateToken(String email, String role) {
        return JWT.create()
                .withSubject(email)
                .withClaim("role", role) // injects the role as the key-value pair inside the token payload
                .withIssuedAt(new Date())
                .withExpiresAt(new Date(System.currentTimeMillis() + jwtExpirationMs))
                .sign(Algorithm.HMAC512(jwtSecret));
    }

    // Validates the token and extracts the email back out safely
    public String validateTokenAndGetEmail(String token) {
        DecodedJWT jwt = JWT.require(Algorithm.HMAC512(jwtSecret))
                .build()
                .verify(token);
        return jwt.getSubject();
    }

}
