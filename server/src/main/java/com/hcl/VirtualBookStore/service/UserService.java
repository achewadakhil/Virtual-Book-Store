package com.hcl.VirtualBookStore.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.hcl.VirtualBookStore.exception.ResourceNotFoundException;
import com.hcl.VirtualBookStore.model.Cart;
import com.hcl.VirtualBookStore.model.User;
import com.hcl.VirtualBookStore.repo.CartRepository;
import com.hcl.VirtualBookStore.repo.UserRepository;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class UserService {


    private final UserRepository userRepository;
    private final CartRepository cartRepository;


    public User register(User user) {
        user.setRole("USER");

        User savedUser = userRepository.save(user);

        Cart cart = new Cart();
        cart.setUser(savedUser);

        cartRepository.save(cart);
        return savedUser;
    }

    public User getUser(Long userId){
        return userRepository.findById(userId)
        .orElseThrow(() -> new ResourceNotFoundException("User not found by id " + userId));
    }

    public List<User> getAll(){
        return userRepository.findAll();
    }

    public User getByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found by email " + email));
    }
}
