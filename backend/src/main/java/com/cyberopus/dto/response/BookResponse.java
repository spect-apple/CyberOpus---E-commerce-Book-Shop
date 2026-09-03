package com.cyberopus.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookResponse {
    private Long id;
    private String title;
    private String author;
    private String description;
    private BigDecimal price;
    private Integer stockQuantity;
    private String isbn;
    private String imageUrl;
    private Integer publicationYear;
    private Boolean active;
    private CategoryResponse category;
    private BrandResponse brand;
    private Long salesCount;
    private LocalDate deliveryDate;
    private Boolean inStock;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
