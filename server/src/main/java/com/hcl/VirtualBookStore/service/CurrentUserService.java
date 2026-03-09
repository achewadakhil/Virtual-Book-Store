package com.hcl.VirtualBookStore.service;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.hcl.VirtualBookStore.exception.ResourceNotFoundException;
import com.hcl.VirtualBookStore.exception.UnauthenticatedException;
import com.hcl.VirtualBookStore.model.User;
import com.hcl.VirtualBookStore.repo.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CurrentUserService {

    private final UserRepository userRepository;

    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null
                || !authentication.isAuthenticated()
                || "anonymousUser".equals(authentication.getName())) {
            throw new UnauthenticatedException("Unauthenticated request");
        }

        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found by email " + email));
    }
}
