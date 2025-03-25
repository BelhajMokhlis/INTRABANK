package com.intrabank.intrabank_backend.service;

import com.intrabank.intrabank_backend.dto.request.CategoryRequest;
import com.intrabank.intrabank_backend.dto.response.CategoryResponse;
import com.intrabank.intrabank_backend.model.Category;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CategoryService {

    Optional<Category> findById(UUID id);
    
    CategoryResponse createCategory(CategoryRequest request);
    
    CategoryResponse getCategoryById(UUID id);
    
    List<CategoryResponse> getAllCategories();
    
    CategoryResponse updateCategory(UUID id, CategoryRequest request);
    
    void deleteCategory(UUID id);
} 