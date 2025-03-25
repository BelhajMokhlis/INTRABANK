package com.intrabank.intrabank_backend.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.intrabank.intrabank_backend.dto.request.VersionDocumentRequest;
import com.intrabank.intrabank_backend.dto.response.VersionDocumentResponse;
import com.intrabank.intrabank_backend.model.VersionDocument;



@Mapper(componentModel = "spring", uses = {FichierDocumentMapper.class})
public interface VersionDocumentMapper {
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "document.id", source = "documentId")
    @Mapping(target = "editeur.id", source = "editeurId")
    @Mapping(target = "dateMiseAJour", expression = "java(java.time.LocalDateTime.now())")
    VersionDocument toEntity(VersionDocumentRequest request);
    
    @Mapping(target = "documentId", source = "document.id")
    @Mapping(target = "editeurId", source = "editeur.id")
    VersionDocumentResponse toResponse(VersionDocument version);
    
    /**
     * Met à jour une instance existante de VersionDocument avec les valeurs de la requête
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "document", ignore = true)
    @Mapping(target = "editeur", ignore = true)
    @Mapping(target = "dateMiseAJour", ignore = true)
    @Mapping(target = "numeroVersion", ignore = true)
    @Mapping(target = "fichiers", ignore = true)
    void updateVersionDocumentFromRequest(VersionDocumentRequest request, @MappingTarget VersionDocument versionDocument);
} 