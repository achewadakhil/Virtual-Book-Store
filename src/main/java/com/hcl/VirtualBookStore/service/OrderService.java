package com.hcl.VirtualBookStore.service;


import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import com.hcl.VirtualBookStore.model.Book;
import com.hcl.VirtualBookStore.model.Cart;
import com.hcl.VirtualBookStore.model.CartItem;
import com.hcl.VirtualBookStore.model.Order;
import com.hcl.VirtualBookStore.model.OrderItem;
import com.hcl.VirtualBookStore.model.User;
import com.hcl.VirtualBookStore.repo.OrderRepository;
import com.hcl.VirtualBookStore.repo.UserRepository;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class OrderService {

    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    
    @Transactional
    public Order checkout(Long user_id){
        //in this method we will be getting all the items from cart and adding them to orders

        User foundUser = userRepository.findById(user_id)
                        .orElseThrow(()->new RuntimeException("User not found"));

        Cart cart = foundUser.getCart();

        if(cart == null||cart.getItems().size() == 0)    return null;

        Order order = new Order();
        order.setOrderDate(LocalDateTime.now());
        order.setStatus("PLACED");
        order.setUser(foundUser);

        double total = 0;

        for(CartItem item : cart.getItems()){
            
            Book book = item.getBook();

            if(book.getStock() < item.getQuantity()){
                throw new RuntimeException("Stock not available "+book.getId());
            }


            OrderItem orderItem = new OrderItem();
            orderItem.setBook(book);
            orderItem.setOrder(order);
            orderItem.setPrice(book.getPrice());
            orderItem.setQuantity(item.getQuantity());


            book.setStock(book.getStock() - item.getQuantity());

            order.getItems().add(orderItem);
            
            total = total + (item.getQuantity() * book.getPrice());

        }

        order.setTotalCost(total);

        cart.getItems().clear();
        return orderRepository.save(order);
    }
}
