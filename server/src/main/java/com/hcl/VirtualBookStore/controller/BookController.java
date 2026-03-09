package com.hcl.VirtualBookStore.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import com.hcl.VirtualBookStore.DTO.request.BookRequest;
import com.hcl.VirtualBookStore.DTO.response.ApiResponse;
import com.hcl.VirtualBookStore.model.Book;
import com.hcl.VirtualBookStore.service.BookService;

import jakarta.validation.Valid;
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

    @PostMapping("/addBook")
    public ResponseEntity<ApiResponse<Book>> addBook(@Valid @RequestBody BookRequest request) {
        Book savedBook = bookService.saveBook(toBook(request));
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success("Book added successfully", savedBook));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Book>> getBook(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Book fetched successfully", bookService.getBookById(id)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteBook(@PathVariable Long id){
        bookService.deleteBook(id);
        return ResponseEntity.ok(ApiResponse.success("Book deleted successfully"));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Book>>> getAllBook(){
        return ResponseEntity.ok(ApiResponse.success("Books fetched successfully", bookService.getBooks()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Book>> updateBook(@PathVariable Long bookId, @Valid @RequestBody BookRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Book updated successfully", bookService.updateBook(bookId, toBook(request))));
    }
    
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<Book>>> searchBooks(@RequestParam String title) {
        return ResponseEntity.ok(ApiResponse.success("Books fetched successfully", bookService.searchByTitle(title)));
    }
    

    @GetMapping("/category")
    public ResponseEntity<ApiResponse<List<Book>>> getByCategory(@RequestParam String category) {
        return ResponseEntity.ok(ApiResponse.success("Books fetched successfully", bookService.getByCategory(category)));
    }
    
    @PostMapping("/load")
    public ResponseEntity<ApiResponse<Void>> load() {
        bookService.loadData();
        return ResponseEntity.ok(ApiResponse.success("Sample books loaded successfully"));
    }

    private Book toBook(BookRequest request) {
        Book book = new Book();
        book.setTitle(request.getTitle());
        book.setAuthor(request.getAuthor());
        book.setPrice(request.getPrice());
        book.setCategory(request.getCategory());
        book.setDescription(request.getDescription());
        book.setStock(request.getStock());
        return book;
    }

}
