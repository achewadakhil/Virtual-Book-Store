package com.hcl.VirtualBookStore.service;


import java.util.Iterator;

import org.springframework.stereotype.Service;

import com.hcl.VirtualBookStore.exception.InsufficientStockException;
import com.hcl.VirtualBookStore.exception.InvalidRequestException;
import com.hcl.VirtualBookStore.exception.ResourceNotFoundException;
import com.hcl.VirtualBookStore.model.Book;
import com.hcl.VirtualBookStore.model.Cart;
import com.hcl.VirtualBookStore.model.CartItem;
import com.hcl.VirtualBookStore.model.User;
import com.hcl.VirtualBookStore.repo.BookRepository;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class CartService {

    private final CurrentUserService currentUserService;
    private final BookRepository bookRepository;

    
    // transactional is used to directly work with DB's roll back and all are managed themselves
    
    @Transactional
    public void addToCart(Long bookId, int quantity) {
        if (quantity <= 0) {
            throw new InvalidRequestException("Quantity must be greater than 0");
        }

        User foundUser = currentUserService.getCurrentUser();

        Book foundBook = bookRepository.findById(bookId)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found by id " + bookId));

        Cart cart = foundUser.getCart();

        if (cart == null) {
            cart = new Cart();
            cart.setUser(foundUser);
            foundUser.setCart(cart);
        }

        for (CartItem cartItem : cart.getItems()) {

            if (cartItem.getBook().getId().equals(bookId)) {
                int updatedQuantity = cartItem.getQuantity() + quantity;
                if (updatedQuantity > foundBook.getStock()) {
                    throw new InsufficientStockException("Requested quantity exceeds stock for book id " + bookId);
                }
                cartItem.setQuantity(updatedQuantity);
                return;
            }
        }

        if (quantity > foundBook.getStock()) {
            throw new InsufficientStockException("Requested quantity exceeds stock for book id " + bookId);
        }

        CartItem cartItem = new CartItem();
        cartItem.setBook(foundBook);
        cartItem.setQuantity(quantity);
        cartItem.setCart(cart);

        cart.getItems().add(cartItem);
    }



    public Cart viewCart(){
        User foundUser = currentUserService.getCurrentUser();
        return getRequiredCart(foundUser);
    }

    @Transactional
    public Cart removeFromCart(Long bookId){
        User foundUser = currentUserService.getCurrentUser();

        Cart cart = getRequiredCart(foundUser);

        boolean removed = cart.getItems().removeIf(item -> item.getBook().getId().equals(bookId));
        if (!removed) {
            throw new ResourceNotFoundException("Book not found in cart by id " + bookId);
        }

        return cart;
    }

    @Transactional
    public Cart removeOne(Long bookId){
        User foundUser = currentUserService.getCurrentUser();

        Cart cart = getRequiredCart(foundUser);

        Iterator<CartItem> iterator = cart.getItems().iterator();
        boolean foundBookInCart = false;

        while (iterator.hasNext()) {
            CartItem item = iterator.next();

            if (item.getBook().getId().equals(bookId)) {
                foundBookInCart = true;

                int newQuantity = item.getQuantity() - 1;

                if (newQuantity <= 0) {
                    iterator.remove();        // safe removal
                } else {
                    item.setQuantity(newQuantity);
                }

                break; // break AFTER finding match
            }
        }

        if (!foundBookInCart) {
            throw new ResourceNotFoundException("Book not found in cart by id " + bookId);
        }

        return cart;
    }

    public double  getTotal(){
        User foundUser = currentUserService.getCurrentUser();

        Cart cart = getRequiredCart(foundUser);

        double total = 0;
        for(CartItem item : cart.getItems()){

            total = total + item.getBook().getPrice() * item.getQuantity();
        }
        return total;
    }

    @Transactional
    public void clearCart() {
        User user = currentUserService.getCurrentUser();

        Cart cart = getRequiredCart(user);
        cart.getItems().clear();

    }

    private Cart getRequiredCart(User user) {
        Cart cart = user.getCart();
        if (cart == null) {
            throw new ResourceNotFoundException("Cart not found for current user");
        }
        return cart;
    }


}
