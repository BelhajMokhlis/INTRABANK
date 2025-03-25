package com.intrabank.intrabank_backend.dto.response;



import java.util.UUID;

import lombok.Builder;
import lombok.Data;

@Data    
@Builder
public class UserResponse {
    private UUID id;
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private String role;
    private String department;
    private String phone;
    private String address;
}
