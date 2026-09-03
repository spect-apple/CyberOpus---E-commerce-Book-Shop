package com.cyberopus.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;

@Configuration
@ConfigurationProperties(prefix = "app")
@Data
public class AppProperties {

    private Delivery delivery = new Delivery();
    private Rewards rewards = new Rewards();

    @Data
    public static class Delivery {
        private BigDecimal charge = new BigDecimal("4.99");
        private int businessDays = 5;
    }

    @Data
    public static class Rewards {
        private int earnRate = 10;
        private int redeemRate = 100;
        private int maxRedeemPct = 20;
    }

    // Convenience getters
    public BigDecimal getDeliveryCharge() {
        return delivery.getCharge();
    }

    public int getDeliveryBusinessDays() {
        return delivery.getBusinessDays();
    }

    public int getRewardsEarnRate() {
        return rewards.getEarnRate();
    }

    public int getRewardsRedeemRate() {
        return rewards.getRedeemRate();
    }

    public int getRewardsMaxRedeemPct() {
        return rewards.getMaxRedeemPct();
    }
}
