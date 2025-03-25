package com.intrabank.intrabank_backend.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.intrabank.intrabank_backend.model.Document;

@Repository
public interface DocumentRepository extends JpaRepository<Document, UUID> {
    
}
