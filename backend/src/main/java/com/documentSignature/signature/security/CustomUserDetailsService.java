package com.documentSignature.signature.security;

import com.documentSignature.signature.model.User;
import com.documentSignature.signature.repository.UserRepository;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

/**
 * core security infrastructure adapter class
 * implements springs UserDetailsService to provide a predictable interface for
 * loading database identities
 * during incoming credentials verification and stateless token authentication
 * passes.
 */
@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {
    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // 1. core lookup: find matching credentials using the indexed email field
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Security Identity Verification aborted: " + email));

        // 2. Map custom enum string value straight to a string-recognized security
        // credential boundary.
        // SimpleGrantedAuthority accepts raw text structurees matching "ROLE_XXXX"
        // formatting patterns.
        GrantedAuthority authority = new SimpleGrantedAuthority(user.getRole().name());

        // 3. construct and emit springs native secure metadata implementation wrapper
        // this packages core user information alongside mapped authority tokens for
        // access management filters
        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                Collections.singletonList(authority));
    }
}
