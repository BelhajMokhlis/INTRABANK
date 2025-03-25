package com.intrabank.intrabank_backend.service.impl;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.intrabank.intrabank_backend.dto.request.FichierDocumentRequest;
import com.intrabank.intrabank_backend.dto.response.FichierDocumentResponse;
import com.intrabank.intrabank_backend.mapper.FichierDocumentMapper;
import com.intrabank.intrabank_backend.model.FichierDocument;
import com.intrabank.intrabank_backend.model.VersionDocument;
import com.intrabank.intrabank_backend.repository.FichierDocumentRepository;
import com.intrabank.intrabank_backend.repository.VersionDocumentRepository;
import com.intrabank.intrabank_backend.service.FichierDocumentService;
import com.intrabank.intrabank_backend.exception.ResourceNotFoundException;
import jakarta.persistence.EntityNotFoundException;

@Service
public class FichierDocumentServiceImpl implements FichierDocumentService {
    
    @Autowired
    private FichierDocumentRepository fichierDocumentRepository;

    @Autowired
    private FichierDocumentMapper fichierDocumentMapper;
    
    @Autowired
    private VersionDocumentRepository versionDocumentRepository;

    @Override
    @Transactional(rollbackFor = Exception.class, timeout = 60)
    public FichierDocumentResponse save(FichierDocumentRequest request) {
        try {
            // 1. Récupérer la version de document existante à partir de la base de données
            VersionDocument versionEntity = versionDocumentRepository.findById(request.getVersionId())
                .orElseThrow(() -> new ResourceNotFoundException("VersionDocument non trouvé avec l'ID: " + request.getVersionId()));
            
            // Vérifier que la version a un document
            if (versionEntity.getDocument() == null) {
                throw new ResourceNotFoundException("Le document associé à cette version est introuvable.");
            }
            
            // 2. Mapper l'entité fichier
            FichierDocument fichierDocument = fichierDocumentMapper.toEntity(request);
            
            // 3. Setter la référence de VersionDocument correcte (celle qui est déjà persistée)
            fichierDocument.setVersionDocument(versionEntity);
            
            // 4. Vérifier le contenu du fichier
            if (fichierDocument.getFichier() == null || fichierDocument.getFichier().length == 0) {
                throw new IllegalArgumentException("Le contenu du fichier ne peut pas être vide");
            }
            
            // 5. Sauvegarder le fichier
            fichierDocument = fichierDocumentRepository.saveAndFlush(fichierDocument);
            
            return fichierDocumentMapper.toResponse(fichierDocument);
        } catch (Exception e) {
            e.printStackTrace(); // Ajout de la trace complète pour un meilleur débogage
            throw new RuntimeException("Erreur lors de la sauvegarde du fichier: " + e.getMessage(), e);
        }
    }   

    @Override
    @Transactional(readOnly = true)
    public FichierDocumentResponse getFichierDocumentById(UUID id) {
        FichierDocument fichierDocument = fichierDocumentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("FichierDocument non trouvé avec l'ID: " + id));
        return fichierDocumentMapper.toResponse(fichierDocument);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<FichierDocumentResponse> getAllFichierDocuments(Pageable pageable) {
        return fichierDocumentRepository.findAll(pageable)
                .map(fichierDocumentMapper::toResponse);
    }

    @Override
    @Transactional
    public FichierDocumentResponse updateFichierDocument(FichierDocumentRequest request) {
        try {
            // 1. Vérifier que la version ID est présente
            if (request.getVersionId() == null) {
                throw new IllegalArgumentException("L'ID de la version est requis");
            }
            
            // 2. Récupérer la version du document
            VersionDocument versionEntity = versionDocumentRepository.findById(request.getVersionId())
                .orElseThrow(() -> new ResourceNotFoundException("VersionDocument non trouvé avec l'ID: " + request.getVersionId()));
            
            // 3. Créer ou mettre à jour le fichier document
            FichierDocument fichierDocument = fichierDocumentMapper.toEntity(request);
            fichierDocument.setVersionDocument(versionEntity);
            
            // 4. Sauvegarder les modifications
            fichierDocumentRepository.save(fichierDocument);
            
            return fichierDocumentMapper.toResponse(fichierDocument);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Erreur lors de la mise à jour du fichier: " + e.getMessage(), e);
        }
    }

    @Override
    @Transactional
    public void deleteFichierDocument(UUID id) {
        fichierDocumentRepository.deleteById(id);
    }



    @Override
    public Resource getFichierResource(UUID id) {
        FichierDocument fichierDocument = fichierDocumentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("FichierDocument non trouvé avec l'ID: " + id));
        return new ByteArrayResource(fichierDocument.getFichier());
    }
    


}

  
