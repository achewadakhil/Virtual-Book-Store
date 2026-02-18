package com.hcl.VirtualBookStore.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hcl.VirtualBookStore.model.User;
import com.hcl.VirtualBookStore.service.UserService;

import lombok.AllArgsConstructor;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/users")
@AllArgsConstructor
public class UserController {

    private final UserService userService;


    @PostMapping("/newUser")
    public void createnewUser(@RequestBody User user) {
       
        userService.createUser(user);
        
    }
    
    
}

