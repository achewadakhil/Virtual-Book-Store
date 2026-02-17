package com.hcl.VirtualBookStore.controller;

import java.util.List;

import org.springframework.web.bind.annotation.RestController;

import com.hcl.VirtualBookStore.model.Book;
import com.hcl.VirtualBookStore.service.BookService;

import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;



@RestController
@AllArgsConstructor
@RequestMapping("/api")
public class BookController {

    private final BookService bookService;

    @GetMapping("/books")
    public List<Book> getAllBook(){
        return bookService.getBooks();
    }

    @PostMapping("/book")
    public void addBook(@RequestBody Book book) {
        bookService.addBook(book);
    }
    
    @PostMapping("/load")
    public void load() {
        bookService.loadData();
    }
    
    

}
