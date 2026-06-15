package com.documentSignature.signature.controller;

import com.documentSignature.signature.model.Document;
import com.documentSignature.signature.model.User;
import com.documentSignature.signature.repository.DocumentRepository;
import com.documentSignature.signature.repository.UserRepository;
import lombok.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Paths;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/documents")
@RequiredArgsConstructor
public class DocumentController {

    private final DocumentRepository documentRepository;
    private final UserRepository userRepository;

    // local execution file directory path definition
    private final String UPLOAD_DIR = System.getProperty("user.dir") + "/uploads/";

    /**
     * secure pdf upload endpoint using multipartfile parsing pipeline
     * security constraints satisfied: only Validators can upload new agreements
     * into the workspace
     * 
     * @param file        the multi-part file content envelop wrapper tracking raw
     *                    pdf doc.
     * @param userDetails injected context reading metadata directly from your
     *                    active security context
     */

    @PostMapping("/upload")
    @PreAuthorize("hasRole('VALIDATOR')") // secure upload endpoint tracking rule
    public ResponseEntity<?> uploadDocument(@RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            // 1. defensively validates that file is present and is a pdf structure
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body("Error: Upload payload contains no file stream");
            }
            if (!"application/pdf".equals(file.getContentType())) {
                return ResponseEntity.badRequest()
                        .body("Error: file format rejected, Only PDF doc uploads are permitted.");
            }

            // 2. ensure targeted physical landing directories exist locally
            File directory = new File(UPLOAD_DIR);
            if (!directory.exists()) {
                directory.mkdirs();
            }

            // 3. resolve the upload path and save the file payload physically onto the
            // storage drive
            String cleanFileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            String targetPath = Paths.get(UPLOAD_DIR, cleanFileName).toString();
            file.transferTo(new File(targetPath));

            // 4. resolve the user context currently logged into the session
            User currentUser = userRepository.findByEmail(userDetails.getUsername())
                    .orElseThrow(() -> new RuntimeException("Error context verification trace: upload user unknown"));

            // 5. construct and persist the file metadata map record block down to db
            Document document = Document.builder()
                    .fileName(file.getOriginalFilename())
                    .filePath(targetPath)
                    .fileType(file.getContentType())
                    .uploadTime(LocalDateTime.now())
                    .uploadedBy(currentUser)
                    .build();

            documentRepository.save(document);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body("Document metadata saved and file uploaded successfully!, Assigned ID: " + document.getId());

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("IO storage operation aborted due to hardware writing restrictions: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An Unexpected execution error occured: " + e.getMessage());
        }
    }
}
