package com.nassim.backend.config;

import com.nassim.backend.model.Token;
import com.nassim.backend.repository.TokenRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.LogoutHandler;

@Configuration
public class CustomLogoutHandler implements LogoutHandler {

    private final TokenRepository tokenRepository;

    public CustomLogoutHandler(TokenRepository tokenRepository) {
        this.tokenRepository = tokenRepository;
    }

    private static final String AUTH_COOKIE_NAME = "refreshToken";
    private void expireCookie(HttpServletResponse response, String cookieName) {
        jakarta.servlet.http.Cookie cookie = new jakarta.servlet.http.Cookie(cookieName, null);
        cookie.setPath("/");
        cookie.setHttpOnly(true);  // Important for security
        cookie.setSecure(false);    // Enable in production (HTTPS only)
        cookie.setMaxAge(0);       // Immediately expire the cookie
        response.addCookie(cookie);
    }
    @Override
    public void logout(HttpServletRequest request,
                       HttpServletResponse response,
                       Authentication authentication) {
        String authHeader = request.getHeader("Authorization");
        final String REFRESH_TOKEN_COOKIE_NAME = "refreshToken";
        if(authHeader == null || !authHeader.startsWith("Bearer ")) {
            return;
        }

        String token = authHeader.substring(7);
        Token storedToken = tokenRepository.findByAccessToken(token).orElse(null);

        if(storedToken != null) {
            storedToken.setLoggedOut(true);
            tokenRepository.save(storedToken);
            expireCookie(response, REFRESH_TOKEN_COOKIE_NAME);
        }

    }
}
