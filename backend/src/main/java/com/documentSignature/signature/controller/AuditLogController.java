package com.documentSignature.signature.controller;

import com.documentSignature.signature.model.AuditLog;
import com.documentSignature.signature.service.AuditLogService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/audit")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class AuditLogController {

    private final AuditLogService auditLogService;

    /**
     * endpoint to fetch the complete chronological audit verification history
     */
    @GetMapping("/document/{documentId}")
    public ResponseEntity<?> fetchDocumentAuditHistory(@PathVariable Long documentId) {

        try {
            List<AuditLog> history = auditLogService.getHistoryForDocument(documentId);
            return ResponseEntity.ok(history);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "error", "Failed to retrieve audit trail matrix: " + e.getMessage()));
        }
    }

    /**
     * core network utility: extract the real IP address of the incoming client
     * request
     */
    public static String getClientIpAddress(HttpServletRequest request) {

        // check if the application is running behind an enterprise proxy/load balancer
        // (like aws elb or cloudflare)
        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("Proxy-Client-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }
        // if testing locally on IPV6 loopback, translate to readable standard localhost
        // format
        if ("0:0:0:0:0:0:0:1".equals(ip)) {
            ip = "127.0.0.1";
        }
        return ip;
    }

}
