package com.intrabank.intrabank_backend.service.impl;

import com.intrabank.intrabank_backend.dto.request.CategoryRequest;
import com.intrabank.intrabank_backend.dto.response.CategoryResponse;
import com.intrabank.intrabank_backend.mapper.CategoryMapper;
import com.intrabank.intrabank_backend.model.Category;
import com.intrabank.intrabank_backend.repository.CategoryRepository;
import com.intrabank.intrabank_backend.service.CategoryService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;

    @Override
    public Optional<Category> findById(UUID id) {
        return categoryRepository.findById(id);
    }

    @Override
    @Transactional
    public CategoryResponse createCategory(CategoryRequest request) {
        Category category = categoryMapper.toEntity(request);
        Category savedCategory = categoryRepository.save(category);
        return categoryMapper.toResponse(savedCategory);
    }

    @Override
    public CategoryResponse getCategoryById(UUID id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Catégorie non trouvée avec l'ID: " + id));
        return categoryMapper.toResponse(category);
    }

    @Override
    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(categoryMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional
    public CategoryResponse updateCategory(UUID id, CategoryRequest request) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Catégorie non trouvée avec l'ID: " + id));
        
        category.setName(request.getName());
        category.setDescription(request.getDescription());
        
        Category updatedCategory = categoryRepository.save(category);
        return categoryMapper.toResponse(updatedCategory);
    }

    @Override
    @Transactional
    public void deleteCategory(UUID id) {
        if (!categoryRepository.existsById(id)) {
            throw new EntityNotFoundException("Catégorie non trouvée avec l'ID: " + id);
        }
        categoryRepository.deleteById(id);
    }
} 