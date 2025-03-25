package com.intrabank.intrabank_backend.repository;

import com.intrabank.intrabank_backend.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends JpaRepository<Category, UUID> {
} 