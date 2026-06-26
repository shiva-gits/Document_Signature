package com.documentSignature.signature.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "signature_invitations")
@Data
@NoArgsConstructor
public class SignatureInvitation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String token;

    private Long documentId;
    private String signerEmail;
    private LocalDateTime expiryDate;
    private boolean used = false;

    @PrePersist
    public void initializeToken() {
        this.token = UUID.randomUUID().toString();
        this.expiryDate = LocalDateTime.now().plusHours(24);
    }

}
