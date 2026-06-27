package com.documentSignature.signature.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

import org.springframework.cglib.core.Local;

@Entity
@Table(name = "audit_logs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long documentId;

    // the tracked life cycle state: UPLOAD, VIEW, SIGN
    @Column(nullable = false)
    private String action;

    // the identifier of who performed the action (e.g. user email or
    // "GUEST_SIGNER")
    @Column(nullable = false)
    private String performedBy;

    // the network IP address tracking code
    @Column(nullable = false)
    private String ipAddress;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    @PrePersist
    protected void onCreate() {
        this.timestamp = LocalDateTime.now();
    }
}
