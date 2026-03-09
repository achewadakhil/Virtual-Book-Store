package com.hcl.VirtualBookStore.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.hcl.VirtualBookStore.DTO.request.AddToCartRequest;
import com.hcl.VirtualBookStore.DTO.response.ApiResponse;
import com.hcl.VirtualBookStore.DTO.response.CartItemResponse;
import com.hcl.VirtualBookStore.DTO.response.CartResponse;
import com.hcl.VirtualBookStore.exception.InvalidRequestException;
import com.hcl.VirtualBookStore.model.Cart;
import com.hcl.VirtualBookStore.model.CartItem;
import com.hcl.VirtualBookStore.service.CartService;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;




@RestController
@RequestMapping("/cart")
@AllArgsConstructor
@PreAuthorize("hasAnyRole('USER','ADMIN')")
public class CartController {

    private final CartService cartService;

    @PostMapping({"/addBook", "/newBook"})
    public ResponseEntity<ApiResponse<Void>> addToCart(@RequestParam(name = "bookId", required = false) Long bookId,
                            @RequestParam(name = "book_id", required = false) Long legacyBookId,
                            @RequestParam int quantity
    ) {
        cartService.addToCart(resolveBookId(bookId, legacyBookId), quantity);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Book added to cart successfully"));
    }

    @PostMapping("/items")
    public ResponseEntity<ApiResponse<Void>> addToCart(@Valid @RequestBody AddToCartRequest request) {
        cartService.addToCart(request.getBookId(), request.getQuantity());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Book added to cart successfully"));
    }
    

    @GetMapping
    public ResponseEntity<ApiResponse<CartResponse>> getCart() {
        return ResponseEntity.ok(ApiResponse.success("Cart fetched successfully", toCartResponse(cartService.viewCart())));
    }


    @DeleteMapping({"/remove/{bookId}", "/items/{bookId}"})
    public ResponseEntity<ApiResponse<CartResponse>> removeFromCart(@PathVariable Long bookId){

            return ResponseEntity.ok(ApiResponse.success("Book removed from cart successfully", toCartResponse(cartService.removeFromCart(bookId))));
        }
    

    @PutMapping({"/decrease/{bookId}", "/items/{bookId}/decrease"})
    public ResponseEntity<ApiResponse<CartResponse>> decreaseOne(@PathVariable Long bookId) {
        
        return ResponseEntity.ok(ApiResponse.success("Cart item quantity updated successfully", toCartResponse(cartService.removeOne(bookId))));
    }

    @GetMapping("/total")
    public ResponseEntity<ApiResponse<Double>> totalCost() {
        return ResponseEntity.ok(ApiResponse.success("Cart total calculated successfully", cartService.getTotal()));
    }
    
    @DeleteMapping({"/clear", "/items"})
    public ResponseEntity<ApiResponse<Void>> clearCart() {
        cartService.clearCart();
        return ResponseEntity.ok(ApiResponse.success("Cart cleared successfully"));
    }

    private CartResponse toCartResponse(Cart cart) {
        List<CartItemResponse> items = cart.getItems().stream()
                .map(this::toCartItemResponse)
                .toList();

        double total = items.stream()
                .mapToDouble(CartItemResponse::getSubtotal)
                .sum();

        return new CartResponse(cart.getId(), items, total);
    }

    private CartItemResponse toCartItemResponse(CartItem item) {
        double unitPrice = item.getBook().getPrice();
        int quantity = item.getQuantity();
        return new CartItemResponse(
                item.getBook().getId(),
                item.getBook().getTitle(),
                unitPrice,
                quantity,
                unitPrice * quantity
        );
    }

    private Long resolveBookId(Long bookId, Long legacyBookId) {
        if (bookId != null) {
            return bookId;
        }
        if (legacyBookId != null) {
            return legacyBookId;
        }
        throw new InvalidRequestException("bookId is required");
    }

}
