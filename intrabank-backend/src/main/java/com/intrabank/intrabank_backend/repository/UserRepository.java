package com.intrabank.intrabank_backend.repository;

import com.intrabank.intrabank_backend.model.Users;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<Users, UUID> {
    Optional<Users> findByEmail(String email);
    Optional<Users> findByUsername(String username);
    Page<Users> findAll(Pageable pageable);
    Page<Users> findAll(Specification<Users> spec, Pageable pageable);
} 