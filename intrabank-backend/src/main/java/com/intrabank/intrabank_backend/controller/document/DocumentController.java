package com.intrabank.intrabank_backend.controller.document;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.intrabank.intrabank_backend.dto.request.DocumentRequest;
import com.intrabank.intrabank_backend.dto.request.DocumentUpdateRequest;
import com.intrabank.intrabank_backend.dto.request.VersionDocumentRequest;
import com.intrabank.intrabank_backend.dto.response.DocumentResponse;
import com.intrabank.intrabank_backend.dto.response.VersionDocumentResponse;
import com.intrabank.intrabank_backend.service.DocumentService;
import com.intrabank.intrabank_backend.service.VersionDocumentService;

@RestController
@RequestMapping("/documents")
public class DocumentController {   
    @Autowired
    private DocumentService documentService;

    @Autowired
    private VersionDocumentService versionDocumentService;

    @PostMapping
    public DocumentResponse save(@RequestBody DocumentRequest document) {
        return documentService.save(document);
    }

    @GetMapping("/{id}")
    public DocumentResponse getDocumentById(@PathVariable UUID id) {
        return documentService.getDocumentById(id);
    }

    @GetMapping
    public Page<DocumentResponse> getAllDocuments(Pageable pageable) {
        return documentService.getAllDocuments(pageable);
    }

    @PutMapping("/{id}")
    public DocumentResponse updateDocument(@PathVariable UUID id, @RequestBody DocumentUpdateRequest documentUpdateRequest) {
        return documentService.updateDocument(id, documentUpdateRequest);
    }

    @DeleteMapping("/{id}")
    public void deleteDocument(@PathVariable UUID id) {
        documentService.deleteDocument(id);
    }

    @PostMapping("/version")
    public VersionDocumentResponse newVersion(@RequestBody VersionDocumentRequest version) {
        return versionDocumentService.save(version);
    }
    
}
