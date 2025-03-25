package com.intrabank.intrabank_backend.dto.request;

import java.util.List;
import java.util.UUID;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import com.intrabank.intrabank_backend.model.Status;
import lombok.Data;

@Data
public class DocumentRequest {
    @NotBlank(message = "Le titre est obligatoire")
    private String titre;

    private Status status;
    
    private String type;
    
    @NotNull(message = "La catégorie est obligatoire")
    private UUID categoryId;
    
    @NotNull(message = "L'auteur est obligatoire")
    private UUID auteurId;
        
    private List<VersionDocumentRequest> versions;

    
} 