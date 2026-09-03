package com.cyberopus.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class CheckoutRequest {

    @NotNull(message = "Address ID is required")
    private Long addressId;

    @Min(value = 0, message = "Reward points to redeem cannot be negative")
    private Integer rewardPointsToRedeem;

    @NotBlank(message = "Card holder name is required")
    @Size(max = 255, message = "Card holder name must not exceed 255 characters")
    private String cardHolderName;

    @NotBlank(message = "Card number is required")
    @Size(min = 4, max = 19, message = "Card number must be between 4 and 19 characters")
    private String cardNumber;

    @NotNull(message = "Expiry month is required")
    @Min(value = 1, message = "Expiry month must be between 1 and 12")
    @Max(value = 12, message = "Expiry month must be between 1 and 12")
    private Integer expiryMonth;

    @NotNull(message = "Expiry year is required")
    @Min(value = 2024, message = "Card has expired")
    private Integer expiryYear;
}
