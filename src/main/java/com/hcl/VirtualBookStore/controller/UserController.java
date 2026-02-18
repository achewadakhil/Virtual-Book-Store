package com.hcl.VirtualBookStore.controller;

import com.hcl.VirtualBookStore.model.Cart;
import com.hcl.VirtualBookStore.model.User;
import com.hcl.VirtualBookStore.repo.CartRepository;
import com.hcl.VirtualBookStore.repo.UserRepository;


import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserRepository userRepository;
    private final CartRepository cartRepository;

    public UserController(UserRepository userRepository,
                          CartRepository cartRepository) {
        this.userRepository = userRepository;
        this.cartRepository = cartRepository;
    }

    @PostMapping("/newUser")
    public void createUser(@RequestBody User user) {

        User savedUser = userRepository.save(user);

        Cart cart = new Cart();
        cart.setUser(savedUser);

        cartRepository.save(cart);
    }
}

