package com.documentSignature.signature.model;

import jakarta.persistence.*;
import lombok.*;

/**
 * Strructural database schema mapping physical signature placement targets.
 * Tracks positional layout components coordinates (x, y) across multiple pages.
 */

@Entity
@Table(name = "signatures")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Signature {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Direct mapping reference: A ocument can have multiple signature boxes
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "document_id", nullable = false)
    private Document document;

    // direct mapping reference: identifies the exact user authorized to sign this
    // box
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "signer_id", nullable = false)
    private User signer;

    @Column(nullable = false)
    private double x; // horizontal offset percentage or point marker index

    @Column(nullable = false)
    private double y; // vertical offset percentage or point marker index

    @Column(nullable = false)
    private int page; // the target page index number inside the pdf binary file

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private SignatureStatus status = SignatureStatus.PENDING;
}
