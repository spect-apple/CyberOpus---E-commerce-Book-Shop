package com.cyberopus.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CartItemResponse {
    private Long id;
    private BookResponse book;
    private Integer quantity;
    private BigDecimal priceAtAdd;
    private BigDecimal currentPrice;
    private Boolean priceChanged;
    private LocalDateTime addedAt;
}
