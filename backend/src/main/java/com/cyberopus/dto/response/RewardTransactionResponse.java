package com.cyberopus.dto.response;

import com.cyberopus.enums.TransactionType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RewardTransactionResponse {
    private Long id;
    private TransactionType type;
    private Integer points;
    private String description;
    private Long orderId;
    private LocalDateTime createdAt;
}
