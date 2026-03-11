package com.hcl.VirtualBookStore.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.access.prepost.PreAuthorize;

import com.hcl.VirtualBookStore.DTO.response.ApiResponse;
import com.hcl.VirtualBookStore.DTO.response.OrderItemResponse;
import com.hcl.VirtualBookStore.DTO.response.OrderResponse;
import com.hcl.VirtualBookStore.model.Order;
import com.hcl.VirtualBookStore.model.OrderItem;
import com.hcl.VirtualBookStore.service.OrderService;
import lombok.AllArgsConstructor;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;


@RestController
@RequestMapping("/orders")
@AllArgsConstructor
@PreAuthorize("hasAnyRole('USER','ADMIN')")
public class OrderController {


    private final OrderService orderService;


    
    

    @PostMapping("/checkout")
        public ResponseEntity<ApiResponse<OrderResponse>> checkout() {
            return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Order placed successfully", toOrderResponse(orderService.checkout())));
        }
    
    @GetMapping
        public ResponseEntity<ApiResponse<List<OrderResponse>>> userOrders() {
            List<OrderResponse> orders = orderService.getOrders()
                .stream()
                .map(this::toOrderResponse)
                .toList();
            return ResponseEntity.ok(ApiResponse.success("Orders fetched successfully", orders));
        }

        private OrderResponse toOrderResponse(Order order) {
        List<OrderItemResponse> items = order.getItems().stream()
            .map(this::toOrderItemResponse)
            .toList();

        return new OrderResponse(
            order.getId(),
            order.getOrderDate(),
            order.getStatus(),
            order.getTotalCost(),
            items
        );
        }

        private OrderItemResponse toOrderItemResponse(OrderItem item) {
        double unitPrice = item.getPrice();
        int quantity = item.getQuantity();

        return new OrderItemResponse(
            item.getBook().getId(),
            item.getBook().getTitle(),
            unitPrice,
            quantity,
            unitPrice * quantity
        );
        }
    
}
