package com.hcl.VirtualBookStore.controller;
import com.hcl.VirtualBookStore.service.UserService;

import lombok.AllArgsConstructor;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hcl.VirtualBookStore.DTO.request.LoginRequest;
import com.hcl.VirtualBookStore.model.User;

@RestController
@RequestMapping("/auth")
@AllArgsConstructor
public class AuthController {

    private final PasswordEncoder passwordEncoder;
    private final UserService userService;
    private final AuthenticationManager authenticationManager;


    @PostMapping("/register")
    public User createnewUser(@RequestBody User user) {
       
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
    public String loginUser(@RequestBody LoginRequest request){
        // System.out.println("hello");

        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                request.getEmail(),
                request.getPassword()
            )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        if(authentication.isAuthenticated()){
            return "Login successfull";
        }
        return "Error logging in";
    } 

}
