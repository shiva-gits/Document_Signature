package com.documentSignature.signature.controller;

import com.documentSignature.signature.dto.SignatureDTO;
import com.documentSignature.signature.model.Document;
import com.documentSignature.signature.model.Signature;
import com.documentSignature.signature.model.SignatureStatus;
import com.documentSignature.signature.model.User;
import com.documentSignature.signature.repository.UserRepository;
import com.documentSignature.signature.repository.DocumentRepository;
import com.documentSignature.signature.repository.SignatureRepository;
import lombok.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/signatures")
@RequiredArgsConstructor
public class SignatureController {

    private final SignatureRepository signatureRepository;
    private final DocumentRepository documentRepository;
    private final UserRepository userRepository;

    /**
     * task 2: save signature coordinates
     * endpoint rule: only validator can drop placeholders and map requirements
     */

    @PostMapping("/request")
    @PreAuthorize("hasRole('VALIDATOR')")
    public ResponseEntity<?> createSignatureRequest(@RequestBody SignatureDTO dto) {

        try {
            // fetch structural entity bindings safely out of data stores
            Document document = documentRepository.findById(dto.getDocId())
                    .orElseThrow(() -> new RuntimeException("Target document profile not found!."));

            User signer = userRepository.findById(dto.getSignerId())
                    .orElseThrow(() -> new RuntimeException("Assigned signer context not found!."));

            // package metadata with position coordinates payload parameters matching your
            // updated enum

            Signature signature = Signature.builder()
                    .document(document)
                    .signer(signer)
                    .x(dto.getX())
                    .y(dto.getY())
                    .page(dto.getPage())
                    .status(SignatureStatus.PENDING) // explicitly assigned to updated status specification
                    .build();

            signatureRepository.save(signature);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body("Signature plcaeholder target mapped and saved cleanly at coordinate boundaries");

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error proceeding placement pipeline matrix parameters: " + e.getMessage());
        }
    }

    /**
     * Display signature plcaeholders
     * endpoint rule: accessible by all roles. returns raw coordinates array blocks
     * so that the frontend canvas engine can draw yellow placeholer highlights
     * precisely
     */

    /**
     * Display signature placeholders
     * endpoint rule: accessible by all roles. returns raw coordinates array blocks
     * so that the frontend canvas engine can draw yellow placeholder highlights
     * precisely
     */
    @GetMapping("/document/{docId}")
    @PreAuthorize("hasAnyRole('VALIDATOR', 'SIGNER', 'WITNESS')")
    public ResponseEntity<?> getDocumentSignatures(@PathVariable("docId") Long docId) { // Added explicit parameter
                                                                                        // mapping

        try {
            List<Signature> signatures = signatureRepository.findByDocumentId(docId);

            // Map entities to a flat, safe structure to prevent Jackson serialization
            // recursion crashes
            List<java.util.Map<String, Object>> flatSignatures = signatures.stream().map(sig -> {
                java.util.Map<String, Object> map = new java.util.HashMap<>();
                map.put("id", sig.getId());
                map.put("x", sig.getX());
                map.put("y", sig.getY());
                map.put("page", sig.getPage());
                map.put("status", sig.getStatus() != null ? sig.getStatus().toString() : "PENDING");

                // Expose safe strings from nested objects instead of the whole entity
                map.put("docId", sig.getDocument() != null ? sig.getDocument().getId() : null);
                map.put("signerId", sig.getSigner() != null ? sig.getSigner().getId() : null);
                map.put("signerEmail", sig.getSigner() != null ? sig.getSigner().getEmail() : "Unknown");
                map.put("signerName", sig.getSigner() != null ? sig.getSigner().getName() : "Unknown");

                return map;
            }).toList();

            return ResponseEntity.ok(flatSignatures);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(java.util.Map.of(
                            "error", "Error fetching structural signature array matching ID",
                            "details", e.getMessage() != null ? e.getMessage() : e.toString()));
        }
    }
}
