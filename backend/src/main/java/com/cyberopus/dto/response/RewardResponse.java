package com.cyberopus.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RewardResponse {
    private Integer balance;
    private Integer totalEarned;
    private Integer totalRedeemed;
    private List<RewardTransactionResponse> transactions;
}
