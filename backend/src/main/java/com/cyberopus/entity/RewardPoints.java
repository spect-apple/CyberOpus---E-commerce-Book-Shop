package com.cyberopus.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "reward_points")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
@ToString(of = {"id", "balance", "totalEarned", "totalRedeemed"})
public class RewardPoints {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(nullable = false)
    @Builder.Default
    private Integer balance = 0;

    @Column(name = "total_earned", nullable = false)
    @Builder.Default
    private Integer totalEarned = 0;

    @Column(name = "total_redeemed", nullable = false)
    @Builder.Default
    private Integer totalRedeemed = 0;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "rewardPoints", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<RewardPointTransaction> transactions = new ArrayList<>();
}
