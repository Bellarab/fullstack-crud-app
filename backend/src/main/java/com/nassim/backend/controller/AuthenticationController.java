package com.nassim.backend.controller;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.nassim.backend.model.AuthenticationResponse;
import com.nassim.backend.model.User;
import com.nassim.backend.repository.UserRepository;
import com.nassim.backend.service.impl.AuthenticationServiceImpl;
import com.nassim.backend.service.impl.JwtServiceImpl;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import jakarta.validation.Valid;
import com.google.api.client.json.jackson2.JacksonFactory;

import java.util.Collections;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:3000") // Allow requests from React frontend running on localhost:3000
public class AuthenticationController {

    private final AuthenticationServiceImpl authService;

    public AuthenticationController(AuthenticationServiceImpl authService) {
        this.authService = authService;
    }

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtServiceImpl jwtService; // Custom JWT service for token handling

    /**
     * Endpoint for user registration.
     * Accepts User object and returns an authentication response.
     */
    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(
            @RequestBody @Valid User request
    ) {
        return ResponseEntity.ok(authService.register(request));
    }

    /**
     * Endpoint for user login.
     * Accepts User credentials and returns authentication tokens.
     */
    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> login(
            @RequestBody User request,
            HttpServletResponse response
    ) {
        AuthenticationResponse authResponse = authService.authenticate(request, response);
        return ResponseEntity.ok(authResponse);
    }

    /**
     * Endpoint to refresh JWT tokens.
     * Uses HttpServletRequest and HttpServletResponse to read/write tokens.
     */
    @PostMapping("/refresh_token")
    public ResponseEntity refreshToken(
            HttpServletRequest request,
            HttpServletResponse response
    ) {
        return authService.refreshToken(request, response);
    }

    /**
     * Endpoint to login using Google OAuth token.
     * Expects a JSON body with a 'token' field containing Google ID token.
     */
    @PostMapping("/oauth-login")
    public ResponseEntity<?> loginWithGoogle(@RequestBody Map<String, String> body, HttpServletResponse response) {
        String googleToken = body.get("token");
        Map<String, Object> tokens = authService.loginWithGoogle(googleToken, response);
        return ResponseEntity.ok(tokens);
    }
}
