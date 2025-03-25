package com.intrabank.intrabank_backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CategoryRequest {
    
    @NotBlank(message = "Le nom de la catégorie est obligatoire")
    private String name;
    
    @NotBlank(message = "La description de la catégorie est obligatoire")
    private String description;
} 