package com.hcl.VirtualBookStore.controller;
import com.hcl.VirtualBookStore.service.UserService;
import lombok.RequiredArgsConstructor;

import jakarta.validation.Valid;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hcl.VirtualBookStore.DTO.request.LoginRequest;
import com.hcl.VirtualBookStore.DTO.request.RefreshTokenRequest;
import com.hcl.VirtualBookStore.DTO.request.RegisterRequest;
import com.hcl.VirtualBookStore.DTO.response.AuthResponse;
import com.hcl.VirtualBookStore.model.User;
import com.hcl.VirtualBookStore.security.JwtService;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final PasswordEncoder passwordEncoder;
    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;


    @PostMapping("/register")
    public User createnewUser(@Valid @RequestBody RegisterRequest request) {
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());
       
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        return userService.register(user);        
    }



        // Login Request
        //     ↓
        // AuthenticationManager
        //     ↓
        // DaoAuthenticationProvider
        //     ↓
        // CustomUserDetailsService
        //     ↓
        // UserRepository (DB)
        //     ↓
        // PasswordEncoder.matches()
        //     ↓
        // Authentication Success/Fail
        //     ↓
        // SecurityContextHolder

        
    @PostMapping("/login")
    public AuthResponse loginUser(@Valid @RequestBody LoginRequest request){
        // System.out.println("hello");

        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                request.getEmail(),
                request.getPassword()
            )
        );


        if(authentication.isAuthenticated()){
            User user = userService.getByEmail(request.getEmail());
            return new AuthResponse(
                jwtService.generateAccessToken(user),
                jwtService.getAccessTokenExpirationMs(),
                jwtService.generateRefreshToken(user),
                jwtService.getRefreshTokenExpirationMs(),
                "Bearer"
            );
        }
        throw new RuntimeException("Invalid credentials");
    }

    @PostMapping("/refresh")
    public AuthResponse refreshToken(@Valid @RequestBody RefreshTokenRequest request) {
        String refreshToken = request.getRefreshToken();
        String email = jwtService.extractUsername(refreshToken);
        User user = userService.getByEmail(email);

        if (!jwtService.validateRefreshToken(refreshToken, user.getEmail())) {
            throw new BadCredentialsException("Invalid refresh token");
        }

        return new AuthResponse(
                jwtService.generateAccessToken(user),
                jwtService.getAccessTokenExpirationMs(),
                jwtService.generateRefreshToken(user),
                jwtService.getRefreshTokenExpirationMs(),
                "Bearer"
        );
    }

}
