package com.hcl.VirtualBookStore.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hcl.VirtualBookStore.model.Book;

public interface BookRepository extends JpaRepository<Book,Long>{
    
}
