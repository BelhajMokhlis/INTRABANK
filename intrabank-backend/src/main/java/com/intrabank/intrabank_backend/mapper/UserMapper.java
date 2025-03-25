package com.intrabank.intrabank_backend.mapper;

import com.intrabank.intrabank_backend.dto.request.UserRequest;
import com.intrabank.intrabank_backend.dto.response.UserResponse;
import com.intrabank.intrabank_backend.model.Users;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface UserMapper {

    UserResponse toResponse(Users user);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "enabled", constant = "true")
    Users toEntity(UserRequest request);

    
}
