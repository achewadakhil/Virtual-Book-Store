package com.hcl.VirtualBookStore.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hcl.VirtualBookStore.model.CartItem;

public interface CartItemRepository extends JpaRepository<CartItem,Long>{
    
}
