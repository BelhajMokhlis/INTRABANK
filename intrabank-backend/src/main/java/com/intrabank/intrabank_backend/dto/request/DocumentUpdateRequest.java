package com.intrabank.intrabank_backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor

public class DocumentUpdateRequest {
    @NotBlank(message = "Le titre est obligatoire")
    private String titre;
    @NotBlank(message = "La catégorie est obligatoire")
    private String categoryId;
    @NotBlank(message = "L'auteur est obligatoire")
    private String auteurId;
}
