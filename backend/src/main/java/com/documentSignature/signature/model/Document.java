package com.documentSignature.signature.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

/**
 * Reusable entity mapping uploaded document metadata
 * storing physical files directly in database BLOBs degrades performance
 * instead, save the file to disk/cloud storage and reference it's file path here.
 */

@Entity
@Table(name = "documents")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor

public class Document{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; //primary key

    @Column(nullable = false)
    private String fileName;

    @Column(nullable = false)
    private String filePath; //storage location descriptor reference string

    @Column(nullable = false)
    private String fileType; // expecting "application/pdf"

    private LocalDateTime uploadTime;

    /**
     * Reusable mapping relationship linking who uploaded the document.
     */

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "uploaded_by_id", nullable = false)
    private User uploadedBy;
}