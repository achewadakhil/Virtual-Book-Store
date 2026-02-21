package com.hcl.VirtualBookStore.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

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


    public void createUser(@RequestBody User user) {

        User savedUser = userRepository.save(user);

        Cart cart = new Cart();
        cart.setUser(savedUser);

        cartRepository.save(cart);
    }

    public User getUser(Long user_id){
        return userRepository.findById(user_id)
        .orElseThrow(()->new RuntimeException("User not found"));
    }

    public List<User> getAll(){
        return userRepository.findAll();
    }
}
