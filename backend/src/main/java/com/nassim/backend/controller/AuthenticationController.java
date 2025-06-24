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
@CrossOrigin(origins = "http://localhost:3000")
public class AuthenticationController {

    private final AuthenticationServiceImpl authService;

    public AuthenticationController(AuthenticationServiceImpl authService) {
        this.authService = authService;
    }
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtServiceImpl jwtService; // Your custom JWT generator

    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(
            @RequestBody @Valid User request
    ) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> login(
            @RequestBody User request,
            HttpServletResponse response
    ) {
        AuthenticationResponse authResponse = authService.authenticate(request, response);
        return ResponseEntity.ok(authResponse);
    }


    @PostMapping("/refresh_token")
    public ResponseEntity refreshToken(
            HttpServletRequest request,
            HttpServletResponse response
    ) {
        return authService.refreshToken(request, response);
    }

    @PostMapping("/oauth-login")
    public ResponseEntity<?> loginWithGoogle(@RequestBody Map<String, String> body, HttpServletResponse response) {
        String googleToken = body.get("token");
        Map<String, Object> tokens = authService.loginWithGoogle(googleToken, response);
        return ResponseEntity.ok(tokens);
    }


}
