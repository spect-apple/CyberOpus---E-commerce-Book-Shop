package com.cyberopus.dto.response;

import com.cyberopus.enums.PaymentStatus;
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
public class PaymentResponse {
    private Long id;
    private PaymentStatus status;
    private String cardHolderName;
    private String maskedCardNumber;
    private BigDecimal amount;
    private LocalDateTime processedAt;
}
