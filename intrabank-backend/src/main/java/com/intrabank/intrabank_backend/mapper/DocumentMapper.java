package com.intrabank.intrabank_backend.mapper;


import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.intrabank.intrabank_backend.dto.request.DocumentRequest;
import com.intrabank.intrabank_backend.dto.response.DocumentResponse;
import com.intrabank.intrabank_backend.model.Document;

@Mapper(componentModel = "spring", uses = {VersionDocumentMapper.class})
public interface DocumentMapper {
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "category.id", source = "categoryId")
    @Mapping(target = "auteur.id", source = "auteurId")
    Document toEntity(DocumentRequest request);
    
    @Mapping(target = "categoryId", source = "category.id")
    @Mapping(target = "categoryName", source = "category.name")
    @Mapping(target = "auteurId", source = "auteur.id")
    @Mapping(target = "auteurNom", source = "auteur.username")
    DocumentResponse toResponse(Document document);



  

} 