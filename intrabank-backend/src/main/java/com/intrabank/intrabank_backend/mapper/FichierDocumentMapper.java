package com.intrabank.intrabank_backend.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.intrabank.intrabank_backend.dto.request.FichierDocumentRequest;
import com.intrabank.intrabank_backend.dto.response.FichierDocumentResponse;
import com.intrabank.intrabank_backend.model.FichierDocument;

@Mapper(componentModel = "spring")
public interface FichierDocumentMapper {
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "versionDocument", ignore = true)
    FichierDocument toEntity(FichierDocumentRequest request);
    
    @Mapping(target = "versionId", expression = "java(fichier.getVersionDocument() != null ? fichier.getVersionDocument().getId() : null)")
    FichierDocumentResponse toResponse(FichierDocument fichier);
} 