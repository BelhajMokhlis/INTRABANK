package com.intrabank.intrabank_backend.controller.profile;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.intrabank.intrabank_backend.dto.request.UserRequest;
import com.intrabank.intrabank_backend.dto.response.UserResponse;
import com.intrabank.intrabank_backend.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;

@RestController
@RequestMapping("/profile")
public class ProfileController {

    @Autowired
    private UserService userService;

    @GetMapping("/me")
public UserResponse getMyProfile(@RequestHeader("Authorization") String authHeader) {
    if (authHeader == null || !authHeader.startsWith("Bearer ")) {
        throw new RuntimeException("Token JWT manquant ou invalide");
    }

    // Extraire le token en supprimant "Bearer "
    String token = authHeader.substring(7);
    System.out.println("Token extrait: " + token);

    return userService.getMyProfile(token);
}

@PutMapping("/me")
public UserResponse updateMyProfile(@RequestHeader("Authorization") String authHeader, @RequestBody UserRequest userRequest) {
    if (authHeader == null || !authHeader.startsWith("Bearer ")) {
        throw new RuntimeException("Token JWT manquant ou invalide");
    }

    String token = authHeader.substring(7);
    System.out.println("Token extrait: " + token);

    return userService.updateMyProfile(token, userRequest);

}

    
}

