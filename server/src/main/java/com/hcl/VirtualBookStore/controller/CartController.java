package com.hcl.VirtualBookStore.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

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
public class CartController {

    private final CartService cartService;

    @PostMapping("/addBook")
    public void addToCart(@RequestParam Long user_id,
                            @RequestParam Long book_id,
                            @RequestParam int quantity
    ) {
        
        cartService.addToCart(user_id, book_id, quantity);
    }
    

    @GetMapping("/{user_id}")
    public Cart getCart(@PathVariable Long user_id) {
        return cartService.viewCart(user_id);
    }


    @DeleteMapping("remove/{user_id}/{book_id}")
    public Cart removeFromCart(@PathVariable Long user_id,
        @PathVariable Long book_id){

            return cartService.removeFromCart(user_id,book_id);
        }
    

    @PutMapping("/decrease/{user_id}/{book_id}")
    public Cart decreaseOne(@PathVariable Long user_id, @PathVariable Long book_id) {
        
        return cartService.removeOne(user_id,book_id);
    }

    @GetMapping("/{user_id}/total")
    public double totalCost(@PathVariable Long user_id) {
        return cartService.getTotal(user_id);
    }
    
    @DeleteMapping("/clear/{userId}")
    public void clearCart(@PathVariable Long userId) {
    cartService.clearCart(userId);
}

}
