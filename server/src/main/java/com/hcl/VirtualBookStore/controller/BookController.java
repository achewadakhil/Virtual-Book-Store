package com.hcl.VirtualBookStore.controller;

import java.util.List;

import org.springframework.web.bind.annotation.RestController;

import com.hcl.VirtualBookStore.model.Book;
import com.hcl.VirtualBookStore.service.BookService;

import lombok.AllArgsConstructor;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@AllArgsConstructor
@RequestMapping("/books")
public class BookController {

    private final BookService bookService;

    @PostMapping
    public void addBook(@RequestBody Book book) {
        bookService.saveBook(book);
    }

    @GetMapping("/{id}")
    public Book getBook(@PathVariable Long id) {
        return bookService.getBookById(id);
    }

    @DeleteMapping("/{id}")
    public void deleteBook(@PathVariable Long id){
        bookService.deleteBook(id);
    }

    @GetMapping
    public List<Book> getAllBook(){
        return bookService.getBooks();
    }

    @PutMapping("/{id}")
    public Book updateBook(@PathVariable Long id, @RequestBody Book book) {
        return bookService.updateBook(id, book);
    }
    
    @GetMapping("/search")
    public List<Book> searchBooks(@RequestParam String title) {
        return bookService.searchByTitle(title);
    }
    

    @GetMapping("/category")
    public List<Book> getByCategory(@RequestParam String category) {
        return bookService.getByCategory(category);
    }
    
    @PostMapping("/load")
    public void load() {
        bookService.loadData();
    }
    
    

}
