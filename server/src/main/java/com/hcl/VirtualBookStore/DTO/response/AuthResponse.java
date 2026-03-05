package com.hcl.VirtualBookStore.DTO.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponse {

    private String accessToken;
    private long accessTokenExpiresInMs;
    private String refreshToken;
    private long refreshTokenExpiresInMs;
    private String tokenType;
}
