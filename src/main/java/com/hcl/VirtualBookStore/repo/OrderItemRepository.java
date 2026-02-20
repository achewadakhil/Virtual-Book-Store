package com.hcl.VirtualBookStore.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hcl.VirtualBookStore.model.OrderItem;

public interface OrderItemRepository extends JpaRepository<OrderItem,Long>{

    
} 