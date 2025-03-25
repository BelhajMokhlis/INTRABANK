package com.intrabank.intrabank_backend.service;

import java.util.UUID;

import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;


import com.intrabank.intrabank_backend.dto.request.FichierDocumentRequest;
import com.intrabank.intrabank_backend.dto.response.FichierDocumentResponse;

public interface FichierDocumentService {

    FichierDocumentResponse save(FichierDocumentRequest request);

    FichierDocumentResponse getFichierDocumentById(UUID id);

    Resource getFichierResource(UUID id);


    Page<FichierDocumentResponse> getAllFichierDocuments(Pageable pageable);
    
    FichierDocumentResponse updateFichierDocument(FichierDocumentRequest request);

    void deleteFichierDocument(UUID id);
}
