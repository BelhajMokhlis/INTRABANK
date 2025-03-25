package com.intrabank.intrabank_backend.controller.admin;


import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.intrabank.intrabank_backend.dto.request.UserRequest;
import com.intrabank.intrabank_backend.dto.response.UserResponse;
import com.intrabank.intrabank_backend.service.UserService;

import lombok.RequiredArgsConstructor;

/**
 * Contrôleur pour la gestion des utilisateurs
 */
@RestController
@RequestMapping("/admin/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    /**
     * Récupère tous les utilisateurs avec filtres optionnels
     * @param pageable Pagination
     * @param department Filtre par département (optionnel)
     * @param role Filtre par rôle (optionnel)
     * @param search Recherche textuelle sur username, firstname et lastname (optionnel)
     * @return Liste des utilisateurs filtrée
     */
    @GetMapping
    public ResponseEntity<Page<UserResponse>> getAllUsers(
            Pageable pageable,
            @RequestParam(required = false) String department,
            @RequestParam(required = false) String role,
            @RequestParam(required = false) String search) {
        return ResponseEntity.ok(userService.getAllUsers(pageable, department, role, search));
    }

    @GetMapping("/list")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsersList());
    }

        

    @PostMapping
    public ResponseEntity<UserResponse> createUser(@RequestBody UserRequest userRequest) {
        return ResponseEntity.ok(userService.addUser(userRequest));
    }

    /**
     * Met à jour le rôle d'un utilisateur
     * @param userId ID de l'utilisateur
     * @param userRequest Nouveau rôle
     * @return Utilisateur mis à jour
     */
    @PutMapping("/{userId}")
    public ResponseEntity<UserResponse> updateUser(@PathVariable String userId, @RequestBody UserRequest userRequest) {
        return ResponseEntity.ok(userService.updateUser(userId, userRequest));
    }

    /**
     * Supprime un utilisateur
     * @param userId ID de l'utilisateur
     * @return Réponse vide
     */
    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> deleteUser(@PathVariable String userId) {
        userService.deleteUser(userId);
        return ResponseEntity.noContent().build();
    }
}
