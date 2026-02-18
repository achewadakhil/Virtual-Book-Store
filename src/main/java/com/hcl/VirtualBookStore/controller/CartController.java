package com.hcl.VirtualBookStore.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.hcl.VirtualBookStore.service.CartService;

import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;


@RestController
@RequestMapping("/cart")
@AllArgsConstructor
public class CartController {

    private final CartService cartService;

    @PostMapping("/addBook")
    public void addToCart(@RequestParam Long user_id,
                            @RequestParam Long book_id,
                            @RequestParam int quantity
    ) {
        
        cartService.addToCart(user_id, book_id, quantity);
    }
    
}
