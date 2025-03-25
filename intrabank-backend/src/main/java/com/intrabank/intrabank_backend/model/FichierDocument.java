package com.intrabank.intrabank_backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.UUID;

@Entity
@Data
public class FichierDocument {
 
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "version_id", nullable = false)
    private VersionDocument versionDocument;

    private String nomFichier;
    private String typeFichier;
    
    @Lob
    @Column(name = "fichier", columnDefinition = "bytea")
    private byte[] fichier;

}


