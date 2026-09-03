package com.cyberopus.entity;

import com.cyberopus.enums.OrderStatus;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
@ToString(of = {"id", "status", "total"})
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private OrderStatus status = OrderStatus.PENDING;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal subtotal;

    @Column(name = "delivery_charge", nullable = false, precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal deliveryCharge = BigDecimal.ZERO;

    @Column(nullable = false, precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal discount = BigDecimal.ZERO;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal total;

    @Column(name = "reward_points_earned", nullable = false)
    @Builder.Default
    private Integer rewardPointsEarned = 0;

    @Column(name = "reward_points_redeemed", nullable = false)
    @Builder.Default
    private Integer rewardPointsRedeemed = 0;

    // Address snapshot
    @Column(name = "snapshot_full_name", nullable = false, length = 255)
    private String snapshotFullName;

    @Column(name = "snapshot_line1", nullable = false, length = 500)
    private String snapshotLine1;

    @Column(name = "snapshot_line2", length = 500)
    private String snapshotLine2;

    @Column(name = "snapshot_city", nullable = false, length = 100)
    private String snapshotCity;

    @Column(name = "snapshot_state", nullable = false, length = 100)
    private String snapshotState;

    @Column(name = "snapshot_postal_code", nullable = false, length = 20)
    private String snapshotPostalCode;

    @Column(name = "snapshot_country", nullable = false, length = 100)
    private String snapshotCountry;

    @Column(name = "snapshot_phone", nullable = false, length = 20)
    private String snapshotPhone;

    @Column(name = "placed_at", nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime placedAt = LocalDateTime.now();

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<OrderItem> items = new ArrayList<>();

    @OneToOne(mappedBy = "order", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Payment payment;
}
