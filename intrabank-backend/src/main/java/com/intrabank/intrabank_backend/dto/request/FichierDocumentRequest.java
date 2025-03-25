package com.intrabank.intrabank_backend.dto.request;

import java.util.UUID;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class FichierDocumentRequest {
    @NotNull(message = "La version du document est obligatoire")
    private UUID versionId;
    
    private String nomFichier;
    private String typeFichier;
    private byte[] fichier;
    

} 