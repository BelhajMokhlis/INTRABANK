package com.intrabank.intrabank_backend.service.impl;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.intrabank.intrabank_backend.dto.request.DocumentRequest;
import com.intrabank.intrabank_backend.dto.request.DocumentUpdateRequest;
import com.intrabank.intrabank_backend.dto.request.VersionDocumentRequest;
import com.intrabank.intrabank_backend.dto.response.DocumentResponse;
import com.intrabank.intrabank_backend.exception.ResourceNotFoundException;
import com.intrabank.intrabank_backend.mapper.DocumentMapper;
import com.intrabank.intrabank_backend.model.Category;
import com.intrabank.intrabank_backend.model.Document;
import com.intrabank.intrabank_backend.model.Status;
import com.intrabank.intrabank_backend.model.Users;
import com.intrabank.intrabank_backend.repository.DocumentRepository;
import com.intrabank.intrabank_backend.service.CategoryService;
import com.intrabank.intrabank_backend.service.DocumentService;
import com.intrabank.intrabank_backend.service.UserService;
import com.intrabank.intrabank_backend.service.VersionDocumentService;

@Service
public class DocumentServiceImpl implements DocumentService {

    @Autowired
    private DocumentRepository documentRepository;

    @Autowired
    private DocumentMapper documentMapper;

    @Autowired
    private VersionDocumentService versionDocumentService;

    @Autowired
    private CategoryService categoryService;

    @Autowired
    private UserService userService;

    @Autowired
    private ObjectMapper objectMapper;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public DocumentResponse save(DocumentRequest document) {
        try {
            
            // 1. Vérifier les données d'entrée
            if (document.getCategoryId() == null) {
                throw new IllegalArgumentException("L'ID de la catégorie est requis");
            }
            
            if (document.getAuteurId() == null) {
                throw new IllegalArgumentException("L'ID de l'auteur est requis");
            }
            
            // 2. Récupérer les entités associées
            Category category = categoryService.findById(document.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Catégorie non trouvée avec l'ID: " + document.getCategoryId()));
                
            Users auteur = userService.findById(document.getAuteurId())
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur non trouvé avec l'ID: " + document.getAuteurId()));
            
            // 3. Créer le document manuellement (sans utiliser le mapper pour les associations)
            Document documentEntity = new Document();
            documentEntity.setTitre(document.getTitre());
            documentEntity.setType(document.getType());
            documentEntity.setStatus(Status.EN_ATTENTE);
            documentEntity.setCategory(category);
            documentEntity.setAuteur(auteur);
            
            // 4. Sauvegarder le document avant de persister les versions
            documentEntity = documentRepository.saveAndFlush(documentEntity); 
            
            // 5. Persister les versions avec l'ID du document
            UUID documentId = documentEntity.getId(); 
            List<VersionDocumentRequest> versions = document.getVersions();
            
            if (versions != null && !versions.isEmpty()) {
                versions.forEach(version -> {
                    version.setDocumentId(documentId);
                    versionDocumentService.save(version);
                });
            }

            
            return documentMapper.toResponse(documentEntity);
            
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Erreur lors de la sauvegarde du document: " + e.getMessage(), e);
        }
    }

    @Override
    public DocumentResponse getDocumentById(UUID id) {
        Document documentEntity = documentRepository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("Document non trouvé avec l'ID: " + id));
        return documentMapper.toResponse(documentEntity);
    }

    @Override
    public Page<DocumentResponse> getAllDocuments(Pageable pageable) {
        return documentRepository.findAll(pageable)
        .map(documentMapper::toResponse);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public DocumentResponse updateDocument(UUID id, DocumentUpdateRequest documentUpdateRequest) {
        try {
            Document documentEntity = documentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Document non trouvé avec l'ID: " + id));

            if(documentUpdateRequest.getCategoryId() != null){  
                Optional<Category> category = categoryService.findById(UUID.fromString(documentUpdateRequest.getCategoryId()));
                documentEntity.setCategory(category.get());
            }
            if(documentUpdateRequest.getAuteurId() != null){
               Optional<Users> auteur = userService.findById(UUID.fromString(documentUpdateRequest.getAuteurId()));
                documentEntity.setAuteur(auteur.get());
            }
            if(documentUpdateRequest.getTitre() != null){
                documentEntity.setTitre(documentUpdateRequest.getTitre());
            }


            documentRepository.save(documentEntity);
            return documentMapper.toResponse(documentEntity);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Erreur lors de la mise à jour du document: " + e.getMessage(), e);
        }
    }

    @Override
    public void deleteDocument(UUID id) {
        documentRepository.deleteById(id);
    }
}
