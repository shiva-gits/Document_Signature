package com.documentSignature.signature.repository;

import com.documentSignature.signature.model.SignatureInvitation;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface SignatureInvitationRepository extends JpaRepository<SignatureInvitation, Long> {
    // lookup query to fetch the token parameters during guest click handshakes
    Optional<SignatureInvitation> findByToken(String token);

}
