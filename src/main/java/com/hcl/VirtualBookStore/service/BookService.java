package com.hcl.VirtualBookStore.service;

import java.util.Arrays;
import java.util.List;

import org.springframework.stereotype.Service;

import com.hcl.VirtualBookStore.model.Book;
import com.hcl.VirtualBookStore.repo.BookRepository;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class BookService {
    
    private final BookRepository bookRepository;

    
    public void saveBook(Book book){
        bookRepository.save(book);
    }
    
    public Book getBookById(Long id){
        return bookRepository.findById(id).orElse(null);
    }

    public List<Book> getBooks(){
        return  bookRepository.findAll();
    }

    public void deleteBook(Long id){
        bookRepository.deleteById(id);
    }

    public void loadData(){


        List<Book> list = Arrays.asList(

            new Book(
                    null,
                    "Clean Code",
                    "Robert C. Martin",
                    499.0,
                    "A handbook of agile software craftsmanship that teaches how to write clean and maintainable code.",
                    "Programming",
                    20
            ),

            new Book(
                    null,
                    "Effective Java",
                    "Joshua Bloch",
                    599.0,
                    "Comprehensive guide covering best practices and advanced Java programming techniques.",
                    "Programming",
                    15
            ),

            new Book(
                    null,
                    "The Pragmatic Programmer",
                    "Andrew Hunt",
                    550.0,
                    "Classic book that provides practical advice for software developers at all stages.",
                    "Programming",
                    18
            ),

            new Book(
                    null,
                    "Atomic Habits",
                    "James Clear",
                    399.0,
                    "A powerful framework for building good habits and breaking bad ones.",
                    "Self-Help",
                    25
            ),

            new Book(
                    null,
                    "Spring in Action",
                    "Craig Walls",
                    650.0,
                    "A detailed guide to building enterprise applications using the Spring Framework.",
                    "Technology",
                    12
            )
        );


        bookRepository.saveAll(list);
    }

}
