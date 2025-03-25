package com.intrabank.intrabank_backend.service.impl;

import java.util.UUID;
import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.intrabank.intrabank_backend.dto.request.FichierDocumentRequest;
import com.intrabank.intrabank_backend.dto.request.VersionDocumentRequest;
import com.intrabank.intrabank_backend.dto.response.VersionDocumentResponse;
import com.intrabank.intrabank_backend.exception.ResourceNotFoundException;
import com.intrabank.intrabank_backend.mapper.VersionDocumentMapper;
import com.intrabank.intrabank_backend.model.VersionDocument;
import com.intrabank.intrabank_backend.repository.VersionDocumentRepository;
import com.intrabank.intrabank_backend.service.FichierDocumentService;
import com.intrabank.intrabank_backend.service.VersionDocumentService;
import com.intrabank.intrabank_backend.model.Document;
import com.intrabank.intrabank_backend.repository.DocumentRepository;
import com.intrabank.intrabank_backend.model.Users;
import com.intrabank.intrabank_backend.service.UserService;

@Service
public class VersionDocumentServiceImpl implements VersionDocumentService {

    @Autowired
    private VersionDocumentRepository versionDocumentRepository;

    @Autowired
    private VersionDocumentMapper versionDocumentMapper;

    @Autowired
    private FichierDocumentService fichierDocumentService;
    
    @Autowired
    private DocumentRepository documentRepository;
    

    @Autowired
    private UserService userService;

    @Override
    @Transactional(rollbackFor = Exception.class, timeout = 60)
    public VersionDocumentResponse save(VersionDocumentRequest request) {
        try {
            // 1. Vérifier les données de la requête
            if (request.getDocumentId() == null) {
                throw new IllegalArgumentException("L'ID du document est requis");
            }
            
            if (request.getEditeurId() == null) {
                throw new IllegalArgumentException("L'ID de l'éditeur est requis");
            }
            
            // 2. Récupérer les entités nécessaires de la base de données
            Document documentEntity = documentRepository.findById(request.getDocumentId())
                .orElseThrow(() -> new ResourceNotFoundException("Document non trouvé avec l'ID: " + request.getDocumentId()));
            
            Users editeurEntity = userService.findById(request.getEditeurId())
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur non trouvé avec l'ID: " + request.getEditeurId()));
            
            // 3. Créer une nouvelle instance de VersionDocument MANUELLEMENT (sans utiliser le mapper)
            VersionDocument versionDocumentEntity = new VersionDocument();
            
            // 4. Configurer les attributs de base à partir de la requête
            versionDocumentEntity.setCommentaire(request.getCommentaire());
            
            // 5. Configurer les attributs générés/calculés
            versionDocumentEntity.setNumeroVersion(calculateNextVersionNumber(request.getDocumentId()));
            versionDocumentEntity.setDateMiseAJour(LocalDateTime.now());
            
            // 6. Associer les entités explicitement
            versionDocumentEntity.setDocument(documentEntity);
            versionDocumentEntity.setEditeur(editeurEntity);
            
            // 7. Persister l'entité
            versionDocumentEntity = versionDocumentRepository.saveAndFlush(versionDocumentEntity);
            
            // 8. Associer et sauvegarder les fichiers (si présents)
            if (request.getFichiers() != null && !request.getFichiers().isEmpty()) {
                for (FichierDocumentRequest fichier : request.getFichiers()) {
                    // Vérifier que le fichier a au moins un nom
                    if (fichier.getNomFichier() == null || fichier.getNomFichier().trim().isEmpty()) {
                        continue; // Ignorer les fichiers sans nom
                    }
                    
                    fichier.setVersionId(versionDocumentEntity.getId());
                    try {
                        fichierDocumentService.save(fichier);
                    } catch (Exception e) {
                        // Loguer l'erreur mais continuer avec les autres fichiers
                        e.printStackTrace();
                        System.err.println("Erreur lors de la sauvegarde du fichier " + fichier.getNomFichier() + ": " + e.getMessage());
                    }
                }
            }
            
            // 9. Recharger l'entité pour s'assurer que tout est à jour
            versionDocumentEntity = versionDocumentRepository.findById(versionDocumentEntity.getId())
                .orElseThrow(() -> new ResourceNotFoundException("VersionDocument introuvable après sauvegarde"));
            
            return versionDocumentMapper.toResponse(versionDocumentEntity);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Erreur lors de la sauvegarde du document: " + e.getMessage(), e);
        }
    }

    private int calculateNextVersionNumber(UUID documentId) {
        // Get the maximum version number for this document
        return versionDocumentRepository.findMaxVersionNumberByDocumentId(documentId)
            .map(maxVersion -> maxVersion + 1)
            .orElse(1); // If no versions exist, start with version 1
    }

    @Override
    public VersionDocumentResponse getVersionDocumentById(UUID id) {
        VersionDocument versionDocumentEntity = versionDocumentRepository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("VersionDocument non trouvé avec l'ID: " + id));
        return versionDocumentMapper.toResponse(versionDocumentEntity);
    }

    @Override
    public Page<VersionDocumentResponse> getAllVersionDocuments(Pageable pageable) {
        Page<VersionDocument> versionDocuments = versionDocumentRepository.findAll(pageable);
        return versionDocuments.map(versionDocumentMapper::toResponse);
    }

    @Override
    @Transactional
    public VersionDocumentResponse updateVersionDocument(UUID id, VersionDocumentRequest request) {
        try {
            // 1. Vérifier les données de la requête
            if (id == null) {
                throw new IllegalArgumentException("L'ID de la version du document est requis pour la mise à jour");
            }
            
            if (request.getDocumentId() == null) {
                throw new IllegalArgumentException("L'ID du document est requis");
            }
            
            if (request.getEditeurId() == null) {
                throw new IllegalArgumentException("L'ID de l'éditeur est requis");
            }
            
            // 2. Récupérer l'entité existante
            VersionDocument existingVersionDocument = versionDocumentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("VersionDocument non trouvé avec l'ID: " + id));
            
            // 3. Récupérer les entités associées
            Document documentEntity = documentRepository.findById(request.getDocumentId())
                .orElseThrow(() -> new ResourceNotFoundException("Document non trouvé avec l'ID: " + request.getDocumentId()));
                
            Users editeurEntity = userService.findById(request.getEditeurId())
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur non trouvé avec l'ID: " + request.getEditeurId()));
            
            // 4. Mettre à jour les attributs
            existingVersionDocument.setCommentaire(request.getCommentaire());
            existingVersionDocument.setDateMiseAJour(LocalDateTime.now());
            
            // 5. Mettre à jour les associations
            existingVersionDocument.setDocument(documentEntity);
            existingVersionDocument.setEditeur(editeurEntity);
            
            // 6. Sauvegarder les modifications
            existingVersionDocument = versionDocumentRepository.save(existingVersionDocument);
            versionDocumentRepository.flush();
            
            // 7. Retourner la réponse
            return versionDocumentMapper.toResponse(existingVersionDocument);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Erreur lors de la mise à jour de la version du document: " + e.getMessage(), e);
        }
    }

    @Override
    @Transactional
    @Deprecated
    public VersionDocumentResponse updateVersionDocument(VersionDocumentRequest request) {
        // Cette méthode est dépréciée. Utilisez updateVersionDocument(UUID, VersionDocumentRequest) à la place.
        try {
            // Cette implémentation tente de créer une nouvelle version plutôt que de mettre à jour une existante
            
            // Vérifier les données de base
            if (request.getDocumentId() == null) {
                throw new IllegalArgumentException("L'ID du document est requis");
            }
            
            if (request.getEditeurId() == null) {
                throw new IllegalArgumentException("L'ID de l'éditeur est requis");
            }
            
            // Créer une nouvelle version
            return save(request);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Erreur lors de la mise à jour de la version du document: " + e.getMessage(), e);
        }
    }

    @Override
    public void deleteVersionDocument(UUID id) {
        versionDocumentRepository.deleteById(id);
    }
}
