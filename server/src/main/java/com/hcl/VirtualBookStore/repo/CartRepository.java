package com.hcl.VirtualBookStore.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hcl.VirtualBookStore.model.Cart;

public interface CartRepository extends JpaRepository<Cart,Long>{
    
}
