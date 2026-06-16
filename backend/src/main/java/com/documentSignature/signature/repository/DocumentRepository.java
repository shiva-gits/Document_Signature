package com.documentSignature.signature.repository;

import com.documentSignature.signature.model.Document;
import com.documentSignature.signature.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {
    // Basic crud operations are inherited automatically from JpaRepository
    /**
     * Reusable custom query derived method
     * spring data jpa automatically parses this method name to generate a sql query
     * equivalent to:
     * Select * from documents where uploaded_by_id = ?
     */
    List<Document> findByUploadedBy(User user);
}