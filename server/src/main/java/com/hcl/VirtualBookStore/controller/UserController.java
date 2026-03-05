package com.hcl.VirtualBookStore.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hcl.VirtualBookStore.model.User;
import com.hcl.VirtualBookStore.service.CurrentUserService;
import com.hcl.VirtualBookStore.service.UserService;

import lombok.AllArgsConstructor;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;


@RestController
@RequestMapping("/users")
@AllArgsConstructor
public class UserController {



    private final UserService userService;
    private final CurrentUserService currentUserService;

    @GetMapping("/public")
    public String publicRoute(){
        return "Public";
    }

    @GetMapping("/me")
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public User getCurrentUser() {
        return currentUserService.getCurrentUser();
    }
    
    @GetMapping({"/{userId}", "/user/{userId}"})
    @PreAuthorize("hasRole('ADMIN')")
    public User getUserById(@PathVariable Long userId) {
        return userService.getUser(userId);
    }
    
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<User> getAll() {
        return userService.getAll();
    }
    
    
}

