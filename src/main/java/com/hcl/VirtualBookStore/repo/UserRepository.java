package com.hcl.VirtualBookStore.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hcl.VirtualBookStore.model.User;

public interface UserRepository extends JpaRepository<User,Long>{
    
}
