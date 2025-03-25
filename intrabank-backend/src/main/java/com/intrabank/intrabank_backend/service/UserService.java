package com.intrabank.intrabank_backend.service;

import com.intrabank.intrabank_backend.dto.request.UserRequest;
import com.intrabank.intrabank_backend.dto.response.UserResponse;
import com.intrabank.intrabank_backend.model.Users;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserService {
    Users saveUser(Users user);
    Optional<Users> findByUsername(String username);
    Optional<Users> findByEmail(String email);
    Optional<Users> findById(UUID id);
    
    

    public UserResponse getMyProfile(String token);
    public UserResponse updateMyProfile(String token, UserRequest userRequest);
    public Page<UserResponse> getAllUsers(Pageable pageable, String department, String role, String search);
    public List<UserResponse> getAllUsersList();
    public UserResponse getUserById(UUID id);
    public UserResponse getUserByUsername(String username);
    public UserResponse addUser(UserRequest request);
    public void deleteUser(String id);
    public UserResponse updateUser(String userId, UserRequest userRequest);
} 