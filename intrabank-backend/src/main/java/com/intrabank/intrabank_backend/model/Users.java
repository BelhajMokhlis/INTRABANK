package com.intrabank.intrabank_backend.model;

import java.util.List;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "users")
public class Users {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(unique = true)
    private String username;

    @Column(unique = true)
    private String email;

    @Column(nullable = false)
    private String password;
    
    @Column(nullable = false)
    @Builder.Default
    private String firstName = "";
    
    @Column(nullable = false)
    @Builder.Default
    private String lastName = "";
    
    @Column(nullable = false)
    @Builder.Default
    private String department = "General";
    
    @Column
    private String phone;
    
    @Column
    private String address;

    @OneToMany(mappedBy = "auteur")
    private List<Document> documents;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Builder.Default
    private boolean accountNonExpired = true;
    
    @Builder.Default
    private boolean enabled = true;
    
    @Builder.Default
    private boolean accountNonLocked = true;
    
    @Builder.Default
    private boolean credentialsNonExpired = true;
    
}