package com.documentSignature.signature.dto;

import com.documentSignature.signature.model.SignatureStatus;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StatusUpdateRequest {
    private SignatureStatus status;
    private String rejectionReason;
}
