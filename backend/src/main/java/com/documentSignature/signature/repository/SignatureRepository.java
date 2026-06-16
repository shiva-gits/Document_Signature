package com.documentSignature.signature.repository;

import com.documentSignature.signature.model.Signature;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SignatureRepository extends JpaRepository<Signature, Long> {
    /**
     * derived query engine generates database lookups mapping signature entries
     * matching a single target document profile
     */
    List<Signature> findByDocumentId(Long documentId);
}