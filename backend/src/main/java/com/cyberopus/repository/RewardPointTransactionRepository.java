package com.cyberopus.repository;

import com.cyberopus.entity.RewardPointTransaction;
import com.cyberopus.enums.TransactionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RewardPointTransactionRepository extends JpaRepository<RewardPointTransaction, Long> {
    List<RewardPointTransaction> findByRewardPointsId(Long rewardPointsId);
    Optional<RewardPointTransaction> findByOrderIdAndType(Long orderId, TransactionType type);
    List<RewardPointTransaction> findByOrderId(Long orderId);
}
