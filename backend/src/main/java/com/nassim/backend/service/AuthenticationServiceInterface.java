package com.nassim.backend.service;

import com.nassim.backend.model.AuthenticationResponse;
import com.nassim.backend.model.User;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseEntity;

public interface AuthenticationServiceInterface {

    AuthenticationResponse register(User request);

    AuthenticationResponse authenticate(User request);

    ResponseEntity<?> refreshToken(HttpServletRequest request, HttpServletResponse response);
}
