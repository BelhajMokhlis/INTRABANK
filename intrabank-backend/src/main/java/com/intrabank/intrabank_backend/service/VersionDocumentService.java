package com.intrabank.intrabank_backend.service;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.intrabank.intrabank_backend.dto.request.VersionDocumentRequest;
import com.intrabank.intrabank_backend.dto.response.VersionDocumentResponse;

public interface VersionDocumentService {

    VersionDocumentResponse save(VersionDocumentRequest request);

    VersionDocumentResponse getVersionDocumentById(UUID id);

    Page<VersionDocumentResponse> getAllVersionDocuments(Pageable pageable);
    
    /**
     * @deprecated Utiliser updateVersionDocument(UUID id, VersionDocumentRequest request) à la place
     */
    @Deprecated
    VersionDocumentResponse updateVersionDocument(VersionDocumentRequest request);
    
    /**
     * Met à jour une version de document existante avec les données fournies
     * @param id L'identifiant de la version à mettre à jour
     * @param request Les données de mise à jour
     * @return La version mise à jour
     */
    VersionDocumentResponse updateVersionDocument(UUID id, VersionDocumentRequest request);

    void deleteVersionDocument(UUID id);
    
}
