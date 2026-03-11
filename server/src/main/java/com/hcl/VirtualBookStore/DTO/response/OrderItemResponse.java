package com.hcl.VirtualBookStore.DTO.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderItemResponse {
    private Long bookId;
    private String title;
    private double unitPrice;
    private int quantity;
    private double subtotal;
}
