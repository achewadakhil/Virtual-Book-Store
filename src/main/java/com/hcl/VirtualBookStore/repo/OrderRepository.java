package com.hcl.VirtualBookStore.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hcl.VirtualBookStore.model.Order;

public interface OrderRepository extends JpaRepository<Order,Long>{
    List<Order> findByUserId(Long userId);
}
