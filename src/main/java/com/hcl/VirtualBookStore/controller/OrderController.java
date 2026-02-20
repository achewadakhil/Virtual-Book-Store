package com.hcl.VirtualBookStore.controller;

import org.springframework.web.bind.annotation.RestController;

import com.hcl.VirtualBookStore.model.Order;
import com.hcl.VirtualBookStore.service.OrderService;

import lombok.AllArgsConstructor;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;


@RestController
@RequestMapping("/orders")
@AllArgsConstructor
public class OrderController {

    private final OrderService orderService;
    

    @PostMapping("/checkout/{user_id}")
    public Order postMethodName(@PathVariable Long user_id) {
        //TODO: process POST request
        
        return orderService.checkout(user_id);
    }
    
}
