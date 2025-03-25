package com.intrabank.intrabank_backend.dto.request;

import java.util.List;
import java.util.UUID;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class VersionDocumentRequest {
    @NotNull(message = "L'ID du document est obligatoire")
    private UUID documentId;
    
    private int numeroVersion;
    
    @NotNull(message = "L'ID de l'éditeur est obligatoire")
    private UUID editeurId;

    private List<FichierDocumentRequest> fichiers;

    private String commentaire;

} 