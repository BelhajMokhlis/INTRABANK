package com.intrabank.intrabank_backend.dto.response;

import java.util.List;
import java.util.UUID;

import com.intrabank.intrabank_backend.model.Status;

import lombok.Data;

@Data
public class DocumentResponse {
    private UUID id;
    private String titre;
    private String type;
    private Status status;

    

    // Informations de la catégorie
    private UUID categoryId;
    private String categoryName;
    
    // Informations de l'auteur
    private UUID auteurId;
    private String auteurNom;
    
    private List<VersionDocumentResponse> versions;
} 