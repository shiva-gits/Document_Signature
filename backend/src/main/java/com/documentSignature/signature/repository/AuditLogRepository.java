package com.documentSignature.signature.repository;

import com.documentSignature.signature.model.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
    // crucial query: fetches chronological history for a specific doc to generate
    // reports
    List<AuditLog> findByDocumentIdOrderByTimestampAsc(Long documentId);

}
