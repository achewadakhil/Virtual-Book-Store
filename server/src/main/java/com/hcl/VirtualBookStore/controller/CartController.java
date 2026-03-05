package com.hcl.VirtualBookStore.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.access.prepost.PreAuthorize;

import com.hcl.VirtualBookStore.model.Cart;
import com.hcl.VirtualBookStore.service.CartService;

import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;




@RestController
@RequestMapping("/cart")
@AllArgsConstructor
@PreAuthorize("hasAnyRole('USER','ADMIN')")
public class CartController {

    private final CartService cartService;

    @PostMapping({"/addBook", "/newBook", "/items"})
    public void addToCart(@RequestParam Long book_id,
                            @RequestParam int quantity
    ) {
        cartService.addToCart(book_id, quantity);
    }
    

    @GetMapping
    public Cart getCart() {
        return cartService.viewCart();
    }


    @DeleteMapping({"/remove/{book_id}", "/items/{book_id}"})
    public Cart removeFromCart(@PathVariable Long book_id){

            return cartService.removeFromCart(book_id);
        }
    

    @PutMapping({"/decrease/{book_id}", "/items/{book_id}/decrease"})
    public Cart decreaseOne(@PathVariable Long book_id) {
        
        return cartService.removeOne(book_id);
    }

    @GetMapping("/total")
    public double totalCost() {
        return cartService.getTotal();
    }
    
    @DeleteMapping({"/clear", "/items"})
    public void clearCart() {
        cartService.clearCart();
    }

}
