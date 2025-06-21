package com.nassim.backend.service;


import com.nassim.backend.model.User;
import org.springframework.security.core.userdetails.UserDetails;

public interface JwtServiceInterface {
    String extractUsername(String token);
    boolean isValid(String token, UserDetails user);
    boolean isValidRefreshToken(String token, User user);
    String generateAccessToken(User user);
    String generateRefreshToken(User user);
}

