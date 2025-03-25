package com.intrabank.intrabank_backend.model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;
import java.util.UUID;

@Entity
@Data

public class Document {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    private String titre;
    private String type;

    @Enumerated(EnumType.STRING)
    private Status status;

    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @ManyToOne
    @JoinColumn(name = "auteur_id", nullable = false)
    private Users auteur; // Auteur de la création initiale

    @OneToMany(mappedBy = "document", cascade = CascadeType.ALL)
    private List<VersionDocument> versions;
    
}
