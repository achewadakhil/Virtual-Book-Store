package com.hcl.VirtualBookStore.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hcl.VirtualBookStore.model.Order;

public interface OrderRepository extends JpaRepository<Order,Long>{
    
}
