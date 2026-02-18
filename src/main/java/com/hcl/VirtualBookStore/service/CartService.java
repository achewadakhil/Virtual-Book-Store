package com.hcl.VirtualBookStore.service;


import org.springframework.stereotype.Service;

import com.hcl.VirtualBookStore.model.Book;
import com.hcl.VirtualBookStore.model.Cart;
import com.hcl.VirtualBookStore.model.CartItem;
import com.hcl.VirtualBookStore.model.User;
import com.hcl.VirtualBookStore.repo.BookRepository;
import com.hcl.VirtualBookStore.repo.UserRepository;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class CartService {

    private final UserRepository userRepository;
    private final BookRepository bookRepository;

    
    // transactional is used to directly work with DB's roll back and all are managed themselves
    
    @Transactional
    public void addToCart(Long user_id, Long book_id, int quantity) {

        User foundUser = userRepository.findById(user_id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Book foundBook = bookRepository.findById(book_id)
                .orElseThrow(() -> new RuntimeException("Book not found"));

        Cart cart = foundUser.getCart();

        if (cart == null) {
            cart = new Cart();
            cart.setUser(foundUser);
            foundUser.setCart(cart);
        }

        for (CartItem cartItem : cart.getItems()) {

            if (cartItem.getBook().getId().equals(book_id)) {
                cartItem.setQuantity(cartItem.getQuantity() + quantity);
                return;
            }
        }

        CartItem cartItem = new CartItem();
        cartItem.setBook(foundBook);
        cartItem.setQuantity(quantity);
        cartItem.setCart(cart);

        cart.getItems().add(cartItem);
    }



    public Cart getCart(Long user_id){
        User foundUser = userRepository.findById(user_id)
        .orElseThrow(()->new RuntimeException("No user found"));
        if(foundUser != null)   return foundUser.getCart();
        return null;
    }
}
