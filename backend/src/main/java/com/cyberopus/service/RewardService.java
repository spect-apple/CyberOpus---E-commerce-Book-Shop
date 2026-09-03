package com.cyberopus.service;

import com.cyberopus.config.AppProperties;
import com.cyberopus.dto.response.RewardResponse;
import com.cyberopus.dto.response.RewardTransactionResponse;
import com.cyberopus.entity.Order;
import com.cyberopus.entity.RewardPointTransaction;
import com.cyberopus.entity.RewardPoints;
import com.cyberopus.entity.User;
import com.cyberopus.enums.TransactionType;
import com.cyberopus.exception.ResourceNotFoundException;
import com.cyberopus.repository.RewardPointTransactionRepository;
import com.cyberopus.repository.RewardPointsRepository;
import com.cyberopus.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RewardService {

    private final RewardPointsRepository rewardPointsRepository;
    private final RewardPointTransactionRepository transactionRepository;
    private final UserRepository userRepository;
    private final AppProperties appProperties;

    @Transactional(readOnly = true)
    public RewardResponse getRewards(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        RewardPoints rp = rewardPointsRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Reward points not found for user"));

        List<RewardTransactionResponse> transactions = transactionRepository
                .findByRewardPointsId(rp.getId())
                .stream()
                .sorted(Comparator.comparing(RewardPointTransaction::getCreatedAt).reversed())
                .map(this::mapToTransactionResponse)
                .collect(Collectors.toList());

        return RewardResponse.builder()
                .balance(rp.getBalance())
                .totalEarned(rp.getTotalEarned())
                .totalRedeemed(rp.getTotalRedeemed())
                .transactions(transactions)
                .build();
    }

    @Transactional
    public void earnPoints(User user, Order order, BigDecimal orderAmount) {
        RewardPoints rp = rewardPointsRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Reward points not found"));

        int pointsEarned = (int) (orderAmount.doubleValue() * appProperties.getRewardsEarnRate());
        rp.setBalance(rp.getBalance() + pointsEarned);
        rp.setTotalEarned(rp.getTotalEarned() + pointsEarned);
        rewardPointsRepository.save(rp);

        order.setRewardPointsEarned(pointsEarned);

        RewardPointTransaction txn = RewardPointTransaction.builder()
                .rewardPoints(rp)
                .type(TransactionType.EARNED)
                .points(pointsEarned)
                .description("Points earned for order #" + order.getId())
                .order(order)
                .build();
        transactionRepository.save(txn);
    }

    @Transactional
    public void redeemPoints(User user, Order order, int pointsToRedeem) {
        if (pointsToRedeem <= 0) return;
        RewardPoints rp = rewardPointsRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Reward points not found"));

        rp.setBalance(rp.getBalance() - pointsToRedeem);
        rp.setTotalRedeemed(rp.getTotalRedeemed() + pointsToRedeem);
        rewardPointsRepository.save(rp);

        RewardPointTransaction txn = RewardPointTransaction.builder()
                .rewardPoints(rp)
                .type(TransactionType.REDEEMED)
                .points(pointsToRedeem)
                .description("Points redeemed for order #" + order.getId())
                .order(order)
                .build();
        transactionRepository.save(txn);
    }

    @Transactional
    public void reverseEarned(User user, Order order) {
        transactionRepository.findByOrderIdAndType(order.getId(), TransactionType.EARNED)
                .ifPresent(txn -> {
                    RewardPoints rp = txn.getRewardPoints();
                    rp.setBalance(rp.getBalance() - txn.getPoints());
                    rp.setTotalEarned(rp.getTotalEarned() - txn.getPoints());
                    rewardPointsRepository.save(rp);

                    RewardPointTransaction reversalTxn = RewardPointTransaction.builder()
                            .rewardPoints(rp)
                            .type(TransactionType.REVERSED_EARN)
                            .points(txn.getPoints())
                            .description("Reversal: points earned for order #" + order.getId() + " (cancelled)")
                            .order(order)
                            .build();
                    transactionRepository.save(reversalTxn);
                });
    }

    @Transactional
    public void reverseRedeemed(User user, Order order) {
        transactionRepository.findByOrderIdAndType(order.getId(), TransactionType.REDEEMED)
                .ifPresent(txn -> {
                    RewardPoints rp = txn.getRewardPoints();
                    rp.setBalance(rp.getBalance() + txn.getPoints());
                    rp.setTotalRedeemed(rp.getTotalRedeemed() - txn.getPoints());
                    rewardPointsRepository.save(rp);

                    RewardPointTransaction reversalTxn = RewardPointTransaction.builder()
                            .rewardPoints(rp)
                            .type(TransactionType.REVERSED_REDEEM)
                            .points(txn.getPoints())
                            .description("Refund: points redeemed for order #" + order.getId() + " (cancelled)")
                            .order(order)
                            .build();
                    transactionRepository.save(reversalTxn);
                });
    }

    private RewardTransactionResponse mapToTransactionResponse(RewardPointTransaction txn) {
        return RewardTransactionResponse.builder()
                .id(txn.getId())
                .type(txn.getType())
                .points(txn.getPoints())
                .description(txn.getDescription())
                .orderId(txn.getOrder() != null ? txn.getOrder().getId() : null)
                .createdAt(txn.getCreatedAt())
                .build();
    }
}
