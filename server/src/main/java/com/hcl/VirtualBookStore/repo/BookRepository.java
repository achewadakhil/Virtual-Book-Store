package com.hcl.VirtualBookStore.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hcl.VirtualBookStore.model.Book;

public interface BookRepository extends JpaRepository<Book,Long>{
    
    List<Book> findByTitleContainingIgnoreCase(String title);
    List<Book> findByCategoryContainingIgnoreCase(String category);
}
