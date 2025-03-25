package com.intrabank.intrabank_backend.dto.response;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import lombok.Data;

@Data
public class VersionDocumentResponse {
    private UUID id;
    private UUID documentId;
    private int numeroVersion;
    private UUID editeurId;
    private LocalDateTime dateMiseAJour;
    private List<FichierDocumentResponse> fichiers;
    private String commentaire;
} 