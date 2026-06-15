package com.documentSignature.signature.repository;

import com.documentSignature.signature.model.Document;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {
    // Basic crud operations are inherited automatically from JpaRepository
}