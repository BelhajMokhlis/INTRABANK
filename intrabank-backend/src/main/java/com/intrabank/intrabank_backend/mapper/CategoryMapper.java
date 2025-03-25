package com.intrabank.intrabank_backend.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.intrabank.intrabank_backend.dto.request.CategoryRequest;
import com.intrabank.intrabank_backend.dto.response.CategoryResponse;
import com.intrabank.intrabank_backend.model.Category;

@Mapper(componentModel = "spring")
public interface CategoryMapper {
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "documents", ignore = true)
    Category toEntity(CategoryRequest request);
    
    CategoryResponse toResponse(Category category);
} 