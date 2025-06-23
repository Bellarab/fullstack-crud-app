package com.nassim.backend.controller;

import com.nassim.backend.model.AuthenticationResponse;
import com.nassim.backend.model.User;
import com.nassim.backend.service.impl.AuthenticationServiceImpl;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import jakarta.validation.Valid;
@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class AuthenticationController {

    private final AuthenticationServiceImpl authService;

    public AuthenticationController(AuthenticationServiceImpl authService) {
        this.authService = authService;
    }


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
}
