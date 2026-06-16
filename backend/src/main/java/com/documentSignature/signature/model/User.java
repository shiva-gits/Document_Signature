package com.documentSignature.signature.model;

// import org.hibernate.annotations.EmbeddableInstantiator;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;
import java.util.List;

@Entity
@Table(name = "users", uniqueConstraints = { @UniqueConstraint(columnNames = "email") })
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class User implements UserDetails { // already implements userDetails

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 50)
    private String name;

    @NotBlank
    @Size(max = 50)
    @Email
    private String email;

    @NotBlank
    @Size(max = 120)
    private String password;

    // ---Updated Spring Security Method ---
    /**
     * EnumType.String saves the actual textual value(e.g. 'ROLE_SIGNER') into the
     * database column
     * REusability note: avoid EnumType.ORDINAL because adding new elements to your
     * Enum later changes thier internal positions, which corrupts historical
     * database rows.
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    // ---UPDATED SPRING SECURITY METHOD ----
    /**
     * converts your custom database role Enum into a collection of spring security
     * GrantedAuthorities
     * this is what @PreAuthorize looks at to grant or deny access.
     */

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // 1. Convert your Enum role to a String using .name()
        String roleName = this.role.name();

        // 2. Safely apply string formatting with the ROLE_ prefix
        String authorityName = roleName.startsWith("ROLE_") ? roleName : "ROLE_" + roleName;

        return List.of(new SimpleGrantedAuthority(authorityName));
    }

    // ----REUSABLE SECURITY CONTRACT METHODS ---
    /**
     * Using Email as the unique username identifier across security contexts.
     */

    @Override
    public String getUsername() {
        return this.email;
    }

    /**
     * Checks whether the user account is expired or not.
     * 
     */
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    /**
     * Checks whether the user account is locked or not.
     * 
     */
    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    /**
     * Checks whether the user credentials (passwords) are not expired or not.
     * 
     */
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    /**
     * Checks whether the user account is enabled or not.
     * 
     */
    @Override
    public boolean isEnabled() {
        return true;
    }
}
