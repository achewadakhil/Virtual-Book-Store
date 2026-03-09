package com.hcl.VirtualBookStore.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hcl.VirtualBookStore.DTO.response.ApiResponse;
import com.hcl.VirtualBookStore.DTO.response.UserResponse;
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
    public ResponseEntity<ApiResponse<String>> publicRoute(){
        return ResponseEntity.ok(ApiResponse.success("Public endpoint accessed", "Public"));
    }

    @GetMapping("/me")
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public ResponseEntity<ApiResponse<UserResponse>> getCurrentUser() {
        return ResponseEntity.ok(ApiResponse.success("Current user fetched successfully", toUserResponse(currentUserService.getCurrentUser())));
    }
    
    @GetMapping({"/{userId}", "/user/{userId}"})
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<UserResponse>> getUserById(@PathVariable Long userId) {
        return ResponseEntity.ok(ApiResponse.success("User fetched successfully", toUserResponse(userService.getUser(userId))));
    }
    
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<UserResponse>>> getAll() {
        List<UserResponse> users = userService.getAll()
                .stream()
                .map(this::toUserResponse)
                .toList();
        return ResponseEntity.ok(ApiResponse.success("Users fetched successfully", users));
    }

    private UserResponse toUserResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole()
        );
    }
    
    
}

