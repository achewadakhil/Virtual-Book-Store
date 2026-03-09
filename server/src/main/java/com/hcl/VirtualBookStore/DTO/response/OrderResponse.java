package com.hcl.VirtualBookStore.DTO.response;

import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderResponse {

    private Long orderId;
    private LocalDateTime orderDate;
    private String status;
    private double totalCost;
    private List<OrderItemResponse> items;
}
