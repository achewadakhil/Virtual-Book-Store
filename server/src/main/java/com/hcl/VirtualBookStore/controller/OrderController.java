package com.hcl.VirtualBookStore.controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.access.prepost.PreAuthorize;

import com.hcl.VirtualBookStore.model.Order;
import com.hcl.VirtualBookStore.service.OrderService;
import lombok.AllArgsConstructor;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;


@RestController
@RequestMapping("/orders")
@AllArgsConstructor
@PreAuthorize("hasAnyRole('USER','ADMIN')")
public class OrderController {


    private final OrderService orderService;


    
    

    @PostMapping("/checkout")
    public Order checkout() {
        return orderService.checkout();
    }
    
    @GetMapping
    public List<Order> userOrders() {
        return orderService.getOrders();
    }
    
}
