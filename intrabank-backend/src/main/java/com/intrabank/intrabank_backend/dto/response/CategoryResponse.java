package com.intrabank.intrabank_backend.dto.response;

import lombok.Data;
import java.util.UUID;

@Data
public class CategoryResponse {
    
    private UUID id;
    private String name;
    private String description;
} 