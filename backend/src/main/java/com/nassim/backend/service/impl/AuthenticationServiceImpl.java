package com.nassim.backend.service.impl;

import com.nassim.backend.model.AuthenticationResponse;
import com.nassim.backend.model.Token;
import com.nassim.backend.model.User;
import com.nassim.backend.repository.TokenRepository;
import com.nassim.backend.repository.UserRepository;
import com.nassim.backend.service.AuthenticationServiceInterface;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.transaction.Transactional;
import jdk.jfr.StackTrace;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AuthenticationServiceImpl implements AuthenticationServiceInterface {
    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtServiceImpl jwtService;
    private final TokenRepository tokenRepository;
    private final AuthenticationManager authenticationManager;

    public AuthenticationServiceImpl(UserRepository repository,
                                     PasswordEncoder passwordEncoder,
                                     JwtServiceImpl jwtService,
                                     TokenRepository tokenRepository,
                                     AuthenticationManager authenticationManager) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.tokenRepository = tokenRepository;
        this.authenticationManager = authenticationManager;
    }

    @Override
    public AuthenticationResponse register(User request) {
        if (repository.findByUsername(request.getUsername()).isPresent()) {
            return new AuthenticationResponse(null, null, "User already exist",null);
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user = repository.save(user);

        String accessToken = jwtService.generateAccessToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        saveUserToken(accessToken, refreshToken, user);

        return new AuthenticationResponse(accessToken, refreshToken, "User registration was successful",user.getUsername());
    }

    @Override
    public AuthenticationResponse authenticate(User request, HttpServletResponse response) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );

        User user = repository.findByUsername(request.getUsername()).orElseThrow();
        String accessToken = jwtService.generateAccessToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        revokeAllTokenByUser(user);
        saveUserToken(accessToken, refreshToken, user);

        // Create HTTP-only, secure cookie with refresh token
        Cookie cookie = new Cookie("refreshToken", refreshToken);
        cookie.setHttpOnly(true);
        cookie.setSecure(false); // change to true in production with HTTPS
        cookie.setPath("/");
        cookie.setMaxAge(7 * 24 * 60 * 60); // 7 days
        response.addCookie(cookie);

        // Return response without refresh token in the body
        return new AuthenticationResponse(accessToken, refreshToken, "User login was successful", user.getUsername());
    }


    private void revokeAllTokenByUser(User user) {
        List<Token> validTokens = tokenRepository.findAllAccessTokensByUser(user.getId());
        if (validTokens.isEmpty()) {
            return;
        }

        validTokens.forEach(t -> t.setLoggedOut(true));
        tokenRepository.saveAll(validTokens);
    }

    private void saveUserToken(String accessToken, String refreshToken, User user) {
        Token token = new Token();
        token.setAccessToken(accessToken);
        token.setRefreshToken(refreshToken);
        token.setLoggedOut(false);
        token.setUser(user);
        tokenRepository.save(token);
    }

    @Transactional
    @Override
    public ResponseEntity<?> refreshToken(HttpServletRequest request, HttpServletResponse response) {
        String token = null;

        // Get refreshToken from cookie
        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if ("refreshToken".equals(cookie.getName())) {
                    token = cookie.getValue();
                    System.out.println("Received refresh token: " + token); // Use proper logging in production
                    break;
                }
            }
        }

        if (token == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        // Extract email from token
        String username = jwtService.extractUsername(token);

        // Get user from DB
        User user = repository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Validate the refresh token
        if (jwtService.isValidRefreshToken(token, user)) {
            // Generate new tokens
            String newAccessToken = jwtService.generateAccessToken(user);
            String newRefreshToken = jwtService.generateRefreshToken(user);

            // Revoke old tokens
            revokeAllTokenByUser(user);

            // Save new tokens
            saveUserToken(newAccessToken, newRefreshToken, user);

            // Create HTTP-only secure refresh cookie
            ResponseCookie refreshCookie = ResponseCookie.from("refreshToken", newRefreshToken)
                    .httpOnly(true)
                    .secure(false) // Set to true in production (only over HTTPS)
                    .path("/")
                    .maxAge(7 * 24 * 60 * 60) // 7 days
                    .build();

            // Add Set-Cookie header
            response.setHeader(HttpHeaders.SET_COOKIE, refreshCookie.toString());

            // Return access token + role in the body (optional)
            return ResponseEntity.ok(new AuthenticationResponse(newAccessToken, newRefreshToken, "success",username));
        }

        return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
    }
}
