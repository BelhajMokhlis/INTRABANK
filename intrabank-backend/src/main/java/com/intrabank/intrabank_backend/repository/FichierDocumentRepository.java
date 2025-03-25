package com.intrabank.intrabank_backend.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.intrabank.intrabank_backend.model.FichierDocument;

public interface FichierDocumentRepository extends JpaRepository<FichierDocument, UUID> {
    
    
}
