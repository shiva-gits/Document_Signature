package com.documentSignature.signature.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * Reusable JWT Authentication Filter.
 * Intercepts every stateless HTTP request to extract the token payload and 
 * establish the authenticated security context including permissions/roles.
 */
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtProvider jwtProvider;
    private final CustomUserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, 
                                    HttpServletResponse response, 
                                    FilterChain filterChain) throws ServletException, IOException {
        
        // 1. Extract the Authorization header from the request
        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String userEmail;

        // 2. Fall back if the token missing or poorly formatted
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        jwt = authHeader.substring(7);
        
        // Extract the subject (email) from the token using your existing provider logic
        userEmail = jwtProvider.validateTokenAndGetEmail(jwt); 

        // 3. Process authentication if the user email exists and security context is unassigned
        if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            
            // Load the User entity (which implements UserDetails and holds getAuthorities())
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);

            // Validate that the token string matches the data store details and hasn't expired
                
            // CRITICAL UPDATE: Extract authorities directly from userDetails (your User entity)
            // This passes the exact database roles (ROLE_SIGNER, etc.) straight into the session context
            UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                    userDetails,
                    null,
                    userDetails.getAuthorities() // Assures roles are mapped to this execution pass
            );

            authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            
            // Finalize binding: Commit the fully authorized token wrapper into Spring's memory context
            SecurityContextHolder.getContext().setAuthentication(authToken);
        }
        
        // Continue down the security filter pipeline execution chain
        filterChain.doFilter(request, response);
    }
}