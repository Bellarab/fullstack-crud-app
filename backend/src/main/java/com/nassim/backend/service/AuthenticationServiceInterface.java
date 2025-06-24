package com.nassim.backend.service;

import com.nassim.backend.model.AuthenticationResponse;
import com.nassim.backend.model.User;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseEntity;

import java.util.Map;

public interface AuthenticationServiceInterface {

    AuthenticationResponse register(User request);

    AuthenticationResponse authenticate(User request,HttpServletResponse response);

    ResponseEntity<?> refreshToken(HttpServletRequest request, HttpServletResponse response);

    Map<String, Object> loginWithGoogle(String googleToken,HttpServletResponse response);
}
