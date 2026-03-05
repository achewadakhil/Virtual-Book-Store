package com.hcl.VirtualBookStore.security;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.HashMap;
import java.util.Date;
import java.util.Map;
import java.util.function.Function;

import org.springframework.stereotype.Service;

import com.hcl.VirtualBookStore.config.JwtProperties;
import com.hcl.VirtualBookStore.model.User;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class JwtService {

    private static final String ACCESS_TOKEN_TYPE = "ACCESS";
    private static final String REFRESH_TOKEN_TYPE = "REFRESH";

    private final JwtProperties jwtProperties;


    private Key getSignKey() {
        return Keys.hmacShaKeyFor(jwtProperties.getSecret().getBytes(StandardCharsets.UTF_8));
    }

    public String generateToken(User user){
        return generateAccessToken(user);
    }

    public String generateAccessToken(User user){
        return generateTokenByType(user, ACCESS_TOKEN_TYPE, jwtProperties.getAccessTokenExpirationMs());
    }

    public String generateRefreshToken(User user){
        return generateTokenByType(user, REFRESH_TOKEN_TYPE, jwtProperties.getRefreshTokenExpirationMs());
    }

    private String generateTokenByType(User user, String tokenType, long expirationMs) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", user.getRole());
        claims.put("userId", user.getId());
        claims.put("tokenType", tokenType);

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(user.getEmail())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expirationMs))
                .signWith(getSignKey(),SignatureAlgorithm.HS256)
                .compact();
    }

    public String extractUsername(String token){
        return extractClaim(token, Claims::getSubject);
    }

    public boolean isTokenExpired(String token){

        Date expiration = extractClaim(token, Claims::getExpiration);
        return expiration.before(new Date());
    }

    public Long extractUserId(String token) {
        Number userId = extractAllClaims(token).get("userId", Number.class);
        return userId == null ? null : userId.longValue();
    }

    public String extractRole(String token) {
        return extractAllClaims(token).get("role", String.class);
    }

    public String extractTokenType(String token) {
        return extractAllClaims(token).get("tokenType", String.class);
    }

    public boolean validateToken(String token,String username){
        return validateToken(token, username, ACCESS_TOKEN_TYPE);
    }

    public boolean validateRefreshToken(String token, String username) {
        return validateToken(token, username, REFRESH_TOKEN_TYPE);
    }

    private boolean validateToken(String token, String username, String tokenType){
        String extractedUsername = extractUsername(token);
        String extractedTokenType = extractTokenType(token);

        return extractedUsername.equals(username)
                && tokenType.equals(extractedTokenType)
                && !isTokenExpired(token);
    }

    public long getAccessTokenExpirationMs() {
        return jwtProperties.getAccessTokenExpirationMs();
    }

    public long getRefreshTokenExpirationMs() {
        return jwtProperties.getRefreshTokenExpirationMs();
    }

    private <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSignKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
