package com.documentSignature.signature.controller;

import com.documentSignature.signature.service.InvitationMailService;
import lombok.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/invitations")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class InvitationController {

    // main service layer processing business workflows
    private final InvitationMailService invitationMailService;

    /**
     * public-facing POST gateway route to receive client parameters and kick off
     * the token distribution routine.
     */
    @PostMapping("/send-link")
    public ResponseEntity<?> sendSigningInvitationLink(@RequestBody Map<String, Object> payload) {

        try {
            // guard check: verify that payload keys are not missing or completely null
            if (!payload.containsKey("documentId") || !payload.containsKey("signerEmail")) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                        "status", "ERROR",
                        "error",
                        "Missing required payload attributes: 'documentId' and 'signerEmail' must be provided."));
            }

            // extract values and translate data structures
            Long docId = Long.parseLong(payload.get("documentId").toString());
            String email = payload.get("signerEmail").toString();

            // fire the protected processing service engine
            String generateUrl = invitationMailService.createAndSendInvitation(docId, email);

            // if the service encountered an exception during database commit, handle the
            // fallback state
            if (generateUrl == null) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                        "status", "FAILED",
                        "error", "The system encountered a database transaction error while alocating token matrics."));
            }

            // standard successfull response channel return
            return ResponseEntity.ok(Map.of(
                    "status", "SUCCESS",
                    "message", "Secure token link generated and sent to " + email + " successfully!.",
                    "debugLink", generateUrl));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "status", "ERROR",
                    "error", "An unexpected runtime validation error occured: " + e.getMessage()));
        }
    }

}
