package com.intrabank.intrabank_backend.service;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.intrabank.intrabank_backend.dto.request.DocumentRequest;
import com.intrabank.intrabank_backend.dto.request.DocumentUpdateRequest;
import com.intrabank.intrabank_backend.dto.response.DocumentResponse;

@Service
public interface DocumentService  {

    DocumentResponse save(DocumentRequest document);

    DocumentResponse getDocumentById(UUID id);

    Page<DocumentResponse> getAllDocuments(Pageable pageable);

    DocumentResponse updateDocument(UUID id, DocumentUpdateRequest documentUpdateRequest);

    void deleteDocument(UUID id);
    
}
