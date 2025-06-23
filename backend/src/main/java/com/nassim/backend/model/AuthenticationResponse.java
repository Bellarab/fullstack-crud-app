package com.nassim.backend.model;

import com.fasterxml.jackson.annotation.JsonProperty;

public class AuthenticationResponse {
    @JsonProperty("access_token")
    private String accessToken;

    @JsonProperty("refresh_token")
    private String refreshToken;

    @JsonProperty("message")
    private String message;

    @JsonProperty("username")
    private String username;

    public AuthenticationResponse(String accessToken, String refreshToken, String message,String username) {
        this.accessToken = accessToken;
        this.message = message;
        this.refreshToken = refreshToken;
        this.username=username;
    }

    public String getAccessToken() {
        return accessToken;
    }

    public String getRefreshToken() {
        return refreshToken;
    }

    public String getMessage() {
        return message;
    }
}
