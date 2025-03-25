package com.intrabank.intrabank_backend.repository;

import java.util.UUID;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.intrabank.intrabank_backend.model.VersionDocument;

@Repository
public interface VersionDocumentRepository extends JpaRepository<VersionDocument, UUID> {
    
    @Query("SELECT MAX(v.numeroVersion) FROM VersionDocument v WHERE v.document.id = :documentId")
    Optional<Integer> findMaxVersionNumberByDocumentId(@Param("documentId") UUID documentId);
}
