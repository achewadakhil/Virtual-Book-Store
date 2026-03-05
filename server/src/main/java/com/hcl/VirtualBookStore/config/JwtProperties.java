package com.hcl.VirtualBookStore.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import lombok.Data;

@Configuration
@ConfigurationProperties(prefix = "app.jwt")
@Data
public class JwtProperties {
    
    /**
     * Secret key used for signing JWT tokens
     * Should be at least 32 characters for HS256
     */
    private String secret;
    
    /**
     * Access token expiration time in milliseconds
     * Default: 15 minutes (900000 ms)
     */
    private long accessTokenExpirationMs;
    
    /**
     * Refresh token expiration time in milliseconds
     * Default: 7 days (604800000 ms)
     */
    private long refreshTokenExpirationMs;
}
