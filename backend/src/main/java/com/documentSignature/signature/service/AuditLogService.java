package com.documentSignature.signature.service;

import com.documentSignature.signature.model.AuditLog;
import com.documentSignature.signature.repository.AuditLogRepository;
import lombok.*;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;

    /**
     * creates an immutable record in the audit database ledger
     */

    public void logEvent(Long documentId, String action, String performedBy, String ipAddress) {

        try {
            AuditLog log = AuditLog.builder()
                    .documentId(documentId)
                    .action(action.toUpperCase())
                    .performedBy(performedBy)
                    .ipAddress(ipAddress)
                    .timestamp(LocalDateTime.now())
                    .build();

            auditLogRepository.save(log);
            System.out.println("📄 AUDIT COMPLIENCE SECURED: " + action + "for doc #" + documentId);
        } catch (Exception e) {

            // high security safety measure: failing to log should never crash the main
            // application
            System.err.println("COMPLIENCE FAILURE: could not write tracking log: " + e.getMessage());
        }
    }

    /**
     * Pulls chronological complience history for a specific document
     */
    public List<AuditLog> getHistoryForDocument(Long documentId) {

        try {
            return auditLogRepository.findByDocumentIdOrderByTimestampAsc(documentId);
        } catch (Exception e) {
            System.err.println("AUDIT FETCH FAILURE: " + e.getMessage());
            return List.of();
        }
    }

}
