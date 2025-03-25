package com.intrabank.intrabank_backend.model;

import jakarta.persistence.*;
import java.util.UUID;
import java.time.LocalDateTime;
import java.util.List;
import lombok.Data;

@Entity
@Data
public class VersionDocument {
@Id
@GeneratedValue(strategy = GenerationType.AUTO)
private UUID id;

@ManyToOne
@JoinColumn(name = "document_id", nullable = false)
private Document document;

private int numeroVersion; // Ex: 1, 2, 3...

@ManyToOne
@JoinColumn(name = "editeur_id", nullable = false)
private Users editeur; // Utilisateur qui a fait la mise à jour

private LocalDateTime dateMiseAJour;

@OneToMany(mappedBy = "versionDocument", cascade = CascadeType.ALL)
private List<FichierDocument> fichiers;

private String commentaire; // Chaque mise à jour doit avoir un commentaire {
    
}
