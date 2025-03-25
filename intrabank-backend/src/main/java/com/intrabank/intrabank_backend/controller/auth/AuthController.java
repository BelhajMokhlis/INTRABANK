package com.intrabank.intrabank_backend.controller.auth;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.intrabank.intrabank_backend.dto.request.LoginRequest;
import com.intrabank.intrabank_backend.dto.response.JwtAuthenticationResponse;
import com.intrabank.intrabank_backend.security.JwtTokenProvider;

import jakarta.validation.Valid;

// import io.swagger.v3.oas.annotations.Operation;
// import io.swagger.v3.oas.annotations.responses.ApiResponse;
// import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/auth")
    // @Tag(name = "Auth", description = "API pour l'authentification")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;
    
    
    @Autowired
    private JwtTokenProvider tokenProvider;

    @PostMapping("/login")
    //   @Operation(summary = "Se connecter", description = "Se connecter")
    //   @ApiResponse(responseCode = "200", description = "Utilisateur connecté avec succès")
    //   @ApiResponse(responseCode = "401", description = "Identifiants incorrects")
    public ResponseEntity<JwtAuthenticationResponse> authenticateUser(@Valid @RequestBody LoginRequest userRequest) {
        try {
            // Create authentication token with username and password
            UsernamePasswordAuthenticationToken authToken = 
                new UsernamePasswordAuthenticationToken(userRequest.getUsername(), userRequest.getPassword());
            
            // Authenticate the token
            Authentication authentication = authenticationManager.authenticate(authToken);
            
            // Set the authentication in the security context
            SecurityContextHolder.getContext().setAuthentication(authentication);
            
            // Generate JWT token
            String jwt = tokenProvider.generateToken(authentication);
            
            // Create and return the response
            JwtAuthenticationResponse response = new JwtAuthenticationResponse();
            response.setAccessToken(jwt);
            return ResponseEntity.ok(response);
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
    }
}


