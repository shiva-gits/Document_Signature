package com.documentSignature.signature.controller;

import com.documentSignature.signature.service.PdfStampingService;

import org.apache.catalina.connector.Response;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/documents")
@CrossOrigin(origins = "http://localhost:3000")
public class DocumentSigningController {

    private final PdfStampingService pdfStampingService;

    public DocumentSigningController(PdfStampingService pdfStampingService) {
        this.pdfStampingService = pdfStampingService;
    }

    /**
     * endpoint to execute the final signature processing of the document
     */

    @PostMapping("/finalize-signature")
    public ResponseEntity<?> finalizeDocumentSignature(@RequestBody Map<String, Object> requestPayload) {
        try {
            // extract and parse the parameters sent from the dashboard ui interaction layer
            float x = Float.parseFloat(requestPayload.get("xCoordinate").toString());
            float y = Float.parseFloat(requestPayload.get("yCoordinate").toString());
            int page = Integer.parseInt(requestPayload.get("PageNumber").toString());
            String signer = requestPayload.get("signerName").toString();

            // setup temporary hardcoded testing files on our desktop filesystem
            String sourceDocument = "C:/Users/shiva/Desktop/shivajava/documentSignature/frontend/public/blank.pdf";
            String signedOutput = "C:/Users/shiva/Desktop/shivajava/documentSignature/frontend/public/signed.pdf";

            // execute the stamping process
            boolean isStreamingSuccessfully = pdfStampingService.generateSignedDocument(sourceDocument, signedOutput, x,
                    y, page, signer);

            // return clean response structure depending on the catch evaluation inside the
            // service layer

            if (!isStreamingSuccessfully) {
                return ResponseEntity.ok(Map.of(
                        "status", "SUCCESS",
                        "message", "Document permanently stamped and locked successfully!",
                        "downloadPath", signedOutput));
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                        "status", "FAILED",
                        "error", "The stamping engine encountered an error. check server logs for the details."));
            }

        } catch (NullPointerException | NumberFormatException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                    "status", "ERROR",
                    "error", "Incomplete or Malformed payload metrics data provided:  " + e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "status", "ERROR",
                    "error", "An unexpected system error occured: " + e.getMessage()));
        }
    }
}
