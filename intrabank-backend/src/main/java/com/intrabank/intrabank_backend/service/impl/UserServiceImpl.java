package com.intrabank.intrabank_backend.service.impl;

import com.intrabank.intrabank_backend.dto.request.UserRequest;
import com.intrabank.intrabank_backend.dto.response.UserResponse;
import com.intrabank.intrabank_backend.exception.ResponseException;
import com.intrabank.intrabank_backend.mapper.UserMapper;
import com.intrabank.intrabank_backend.model.Role;
import com.intrabank.intrabank_backend.model.Users;
import com.intrabank.intrabank_backend.repository.UserRepository;
import com.intrabank.intrabank_backend.security.JwtTokenProvider;
import com.intrabank.intrabank_backend.service.UserService;
import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    private final JwtTokenProvider jwtTokenProvider;

    @Override
    public Users saveUser(Users user) {
        return userRepository.save(user);
    }

    @Override
    public Optional<Users> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    @Override
    public Optional<Users> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Override
    public Optional<Users> findById(UUID id) {
        return userRepository.findById(id);
    }

    @Override
    public Page<UserResponse> getAllUsers(Pageable pageable, String department, String role, String search) {
        Specification<Users> spec = Specification.where(null);
        
        if (department != null && !department.isEmpty()) {
            spec = spec.and((root, query, cb) -> 
                cb.equal(root.get("department"), department));
        }
        
        if (role != null && !role.isEmpty()) {
            spec = spec.and((root, query, cb) -> 
                cb.equal(root.get("role"), role));
        }
        
        if (search != null && !search.isEmpty()) {
            spec = spec.and((root, query, cb) -> 
                cb.or(
                    cb.like(cb.lower(root.get("username")), "%" + search.toLowerCase() + "%"),
                    cb.like(cb.lower(root.get("firstName")), "%" + search.toLowerCase() + "%"),
                    cb.like(cb.lower(root.get("lastName")), "%" + search.toLowerCase() + "%")
                ));
        }
        
        return userRepository.findAll(spec, pageable).map(userMapper::toResponse);
    }
    public List<UserResponse> getAllUsersList() {
        return userRepository.findAll().stream()
                .map(userMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public UserResponse getMyProfile(String token) {
        System.out.println("9awad2: " + token);
        // get the user id from the token
        String username = jwtTokenProvider.getUsernameFromJWT(token);
        return findByUsername(username)
                .map(userMapper::toResponse)
                .orElseThrow(() -> new ResponseException("User not found with username: " + username, HttpStatus.NOT_FOUND));
    }

    @Override
    public UserResponse getUserByUsername(String username) {
        return findByUsername(username)
                .map(userMapper::toResponse)
                .orElseThrow(() -> new ResponseException("User not found with username: " + username, HttpStatus.NOT_FOUND));
    }

    @Override
    public UserResponse updateMyProfile(String token, UserRequest userRequest) {
        // get the user id from the token and update the user
        String username = jwtTokenProvider.getUsernameFromJWT(token);
        Users user = findByUsername(username)
                .orElseThrow(() -> new ResponseException("User not found with username: " + username, HttpStatus.NOT_FOUND));

        user.setFirstName(userRequest.getFirstName());
        user.setLastName(userRequest.getLastName());
        user.setPhone(userRequest.getPhone());
        user.setAddress(userRequest.getAddress());
        
        return userMapper.toResponse(saveUser(user));
    }




    @Override
    public UserResponse getUserById(UUID id) {
        return userRepository.findById(id)
                .map(userMapper::toResponse)
                .orElseThrow(() -> new ResponseException("User not found with id: " + id, HttpStatus.NOT_FOUND));
    }

    @Override
    public UserResponse addUser(UserRequest request) {
        // Vérifier si le nom d'utilisateur existe déjà
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new ResponseException("Ce nom d'utilisateur est déjà pris", HttpStatus.CONFLICT);
        }
        
        // Convertir la requête en entité
        Users user = userMapper.toEntity(request);
        
        // Encoder le mot de passe
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        
        // Définir le rôle (si non spécifié, utiliser EMPLOYEE par défaut)
        if (user.getRole() == null) {
            user.setRole(Role.EMPLOYEE);
        }
        
        // Activer le compte par défaut
        user.setEnabled(true);
        user.setAccountNonExpired(true);
        user.setAccountNonLocked(true);
        user.setCredentialsNonExpired(true);
        
        // Sauvegarder l'utilisateur
        Users savedUser = userRepository.save(user);
        
        return userMapper.toResponse(savedUser);
    }

    @Override
    public void deleteUser(String id) {
        userRepository.deleteById(UUID.fromString(id));
    }
    
    @Override
    public UserResponse updateUser(String userId, UserRequest userRequest) {
        Users user = userRepository.findById(UUID.fromString(userId))
                .orElseThrow(() -> new ResponseException("User not found with id: " + userId, HttpStatus.NOT_FOUND));
        if (userRequest.getFirstName() != null) {   
            user.setFirstName(userRequest.getFirstName());
        }
        if (userRequest.getLastName() != null) {
            user.setLastName(userRequest.getLastName());
        }
        if (userRequest.getPhone() != null) {
            user.setPhone(userRequest.getPhone());
        }
        if (userRequest.getAddress() != null) {
            user.setAddress(userRequest.getAddress());
        }
        if (userRequest.getRole() != null) {
            user.setRole(userRequest.getRole());
        }
        if (userRequest.getDepartment() != null) {
            user.setDepartment(userRequest.getDepartment());
        }
       
        return userMapper.toResponse(saveUser(user));
    }
    
    
    
}   