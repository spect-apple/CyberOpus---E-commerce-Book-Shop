package com.cyberopus.dto.response;

import com.cyberopus.enums.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponse {
    private Long id;
    private OrderStatus status;
    private List<OrderItemResponse> items;
    private BigDecimal subtotal;
    private BigDecimal deliveryCharge;
    private BigDecimal discount;
    private BigDecimal total;
    private Integer rewardPointsEarned;
    private Integer rewardPointsRedeemed;
    // Address snapshot
    private String snapshotFullName;
    private String snapshotLine1;
    private String snapshotLine2;
    private String snapshotCity;
    private String snapshotState;
    private String snapshotPostalCode;
    private String snapshotCountry;
    private String snapshotPhone;
    private LocalDateTime placedAt;
    private Boolean canCancel;
}
