package com.hcl.VirtualBookStore.DTO.response;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CartResponse {

    private Long cartId;
    private List<CartItemResponse> items;
    private double total;
}
