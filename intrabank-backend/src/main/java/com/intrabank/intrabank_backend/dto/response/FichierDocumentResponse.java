package com.intrabank.intrabank_backend.dto.response;

import java.util.UUID;
import lombok.Data;

@Data
public class FichierDocumentResponse {
    private UUID id;
    private UUID versionId;
    private String nomFichier;
    private String typeFichier;
} 