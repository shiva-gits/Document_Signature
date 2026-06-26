package com.documentSignature.signature.service;

import com.documentSignature.signature.model.SignatureInvitation;
import com.documentSignature.signature.repository.SignatureInvitationRepository;
import lombok.*;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class InvitationMailService {

    // dependency to record token handshake in the database

    private final SignatureInvitationRepository signatureInvitationRepository;
    // dependency for sending mails - configured by spring.mail properties to
    // connect to the smtp server
    private final JavaMailSender javaMailSender;

    /**
     * Generates a token record, writes it to the database ledger, and handles the
     * SMTP network delivery.
     * * @param documentId The primary key index of the PDF file target
     * 
     * @param signerEmail The target validation address of the external guest client
     * @return The generated secure public URL string, or null if the routine breaks
     */

    public String createAndSendInvitation(Long documentId, String signerEmail) {
        SignatureInvitation savedInvitation;

        // catch block A: safe database isolation layer
        try {
            SignatureInvitation invitation = new SignatureInvitation();
            invitation.setDocumentId(documentId);
            invitation.setSignerEmail(signerEmail);

            // this persistance step automatically triggers @PrePersist to generate our
            // secure UUID token
            savedInvitation = signatureInvitationRepository.save(invitation);
        } catch (Exception e) {
            System.err.println(
                    "CRITICAL DATA TRANSACTION EXCEPTION: failed to commit the signature invitation token row. Reason: "
                            + e.getMessage());
            return null;
        }

        // Generate the destination link pointing directly to our react local routing
        // address.
        // we use the saved invitation record ID to reconstruct the exact URL in the
        // email body
        String publicSigningUrl = "http://localhost:3000/public/sign/" + savedInvitation.getToken();

        // catch block B: safe network/smtp isolation layer
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("verification@signledger.com");
            message.setTo(signerEmail);
            message.setSubject("Signature Request: Review and Execute Document Matrix");
            message.setText(
                    "Hello, \n\n You have been requested as an external guest to review and sign on the official document (#"
                            + documentId + ").\n\n"
                            + "Please click the secure signle-use token URL link below to access your visual design canvas workspace: \n"
                            + publicSigningUrl + "\n\n"
                            + "⚠️ This secure validation link will automatically expire in 24 hours. \n\n"
                            + "Best Regards, \n SignLedger Automation Dispatcher");

            // dispatches the compiled metadata payload out to the smtp server
            javaMailSender.send(message);

            return publicSigningUrl;
        } catch (MailException e) {
            System.err.println(
                    "NETWORK DISPATCH ERROR: SMTP transmission breakdown occured. check the yml file for the credentials. Reason: "
                            + e.getMessage());
            // we return the url string anyway so development environments can grab the
            // token link from the console even without internet
            return publicSigningUrl;
        }

    }
}
