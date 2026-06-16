package com.documentSignature.signature.dto;

import lombok.*;

/**
 * inbound request DTO payload parsing structure mapping coordinate drops
 * this class acts as a plain data container with no business logic.
 */

@Data
public class SignatureDTO {
    private Long docId;
    private Long signerId;
    private double x;
    private double y;
    private int page;
}
