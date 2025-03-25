package com.intrabank.intrabank_backend.security;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.intrabank.intrabank_backend.exception.ResponseException;
import com.intrabank.intrabank_backend.model.Users;
import com.intrabank.intrabank_backend.repository.UserRepository;

import org.springframework.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Collection;
import java.util.Collections;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Users user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseException("User not found with username: " + username, HttpStatus.NOT_FOUND));
        
        return new CustomUserDetails(user);
    }
    
    public static class CustomUserDetails implements UserDetails {
        private final Users user;
        
        public CustomUserDetails(Users user) {
            this.user = user;
        }
        
        @Override
        public Collection<? extends GrantedAuthority> getAuthorities() {
            // User has only one role
            return Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()));
        }

        @Override
        public String getPassword() {
            return user.getPassword();
        }

        @Override
        public String getUsername() {
            return user.getUsername();
        }

        @Override
        public boolean isAccountNonExpired() {
            return user.isAccountNonExpired();
        }

        @Override
        public boolean isAccountNonLocked() {
            return user.isAccountNonLocked();
        }

        @Override
        public boolean isCredentialsNonExpired() {
            return user.isCredentialsNonExpired();
        }

        @Override
        public boolean isEnabled() {
            return user.isEnabled();
        }
    }
}
