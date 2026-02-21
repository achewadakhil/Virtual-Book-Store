package com.hcl.VirtualBookStore.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hcl.VirtualBookStore.model.User;
import com.hcl.VirtualBookStore.service.UserService;

import lombok.AllArgsConstructor;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;





@RestController
@RequestMapping("/users")
@AllArgsConstructor
public class UserController {

    private final UserService userService;


    @PostMapping("/newUser")
    public void createnewUser(@RequestBody User user) {
       
        userService.createUser(user);
        
    }
    
    @GetMapping("/user/{user_id}")
    public User getUserById(@PathVariable Long user_id) {
        return userService.getUser(user_id);
    }
    
    @GetMapping
    public List<User> getAll() {
        return userService.getAll();
    }
    
    
}

