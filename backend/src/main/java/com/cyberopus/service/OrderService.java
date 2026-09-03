package com.cyberopus.service;

import com.cyberopus.dto.request.CartItemRequest;
import com.cyberopus.dto.response.CartResponse;
import com.cyberopus.dto.response.OrderResponse;
import com.cyberopus.dto.response.PageResponse;
import com.cyberopus.entity.*;
import com.cyberopus.enums.OrderStatus;
import com.cyberopus.enums.PaymentStatus;
import com.cyberopus.exception.BadRequestException;
import com.cyberopus.exception.ForbiddenException;
import com.cyberopus.exception.ResourceNotFoundException;
import com.cyberopus.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final BookRepository bookRepository;
    private final PaymentRepository paymentRepository;
    private final CartService cartService;
    private final RewardService rewardService;
    private final CheckoutService checkoutService;

    @Transactional(readOnly = true)
    public PageResponse<OrderResponse> findAllForUser(String email, int page, int size) {
        User user = getUser(email);
        Pageable pageable = PageRequest.of(page, size);
        Page<Order> orderPage = orderRepository.findByUserIdOrderByPlacedAtDesc(user.getId(), pageable);
        return PageResponse.from(orderPage, checkoutService::mapToOrderResponse);
    }

    @Transactional(readOnly = true)
    public OrderResponse findById(Long orderId, String email) {
        User user = getUser(email);
        Order order = orderRepository.findByIdAndUserId(orderId, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Order", orderId));
        return checkoutService.mapToOrderResponse(order);
    }

    @Transactional
    public OrderResponse cancel(Long orderId, String email) {
        User user = getUser(email);
        Order order = orderRepository.findByIdAndUserId(orderId, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Order", orderId));

        // Verify cancellable status
        if (order.getStatus() == OrderStatus.CANCELLED) {
            throw new BadRequestException("Order is already cancelled");
        }
        if (order.getStatus() != OrderStatus.PENDING && order.getStatus() != OrderStatus.CONFIRMED) {
            throw new BadRequestException("Order cannot be cancelled in status: " + order.getStatus());
        }

        // Server-side 48-hour window check
        if (order.getPlacedAt().isBefore(LocalDateTime.now().minusHours(48))) {
            throw new BadRequestException(
                    "Order cancellation window (48 hours) has expired. " +
                    "Order was placed at: " + order.getPlacedAt());
        }

        // Restore stock
        for (OrderItem item : order.getItems()) {
            if (item.getBook() != null) {
                Book book = bookRepository.findById(item.getBook().getId()).orElse(null);
                if (book != null) {
                    book.setStockQuantity(book.getStockQuantity() + item.getQuantity());
                    book.setSalesCount(Math.max(0, book.getSalesCount() - item.getQuantity()));
                    bookRepository.save(book);
                }
            }
        }

        // Reverse reward points
        if (order.getRewardPointsEarned() > 0) {
            rewardService.reverseEarned(user, order);
        }
        if (order.getRewardPointsRedeemed() > 0) {
            rewardService.reverseRedeemed(user, order);
        }

        // Refund payment if it was successful
        paymentRepository.findByOrderId(order.getId()).ifPresent(payment -> {
            if (payment.getStatus() == PaymentStatus.SUCCESS) {
                payment.setStatus(PaymentStatus.REFUNDED);
                paymentRepository.save(payment);
            }
        });

        order.setStatus(OrderStatus.CANCELLED);
        order = orderRepository.save(order);
        return checkoutService.mapToOrderResponse(order);
    }

    @Transactional
    public CartResponse buyAgain(Long orderId, String email) {
        User user = getUser(email);
        Order order = orderRepository.findByIdAndUserId(orderId, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Order", orderId));

        int added = 0;
        for (OrderItem item : order.getItems()) {
            if (item.getBook() != null && item.getBook().getActive()
                    && item.getBook().getStockQuantity() > 0) {
                try {
                    CartItemRequest req = new CartItemRequest();
                    req.setBookId(item.getBook().getId());
                    req.setQuantity(Math.min(item.getQuantity(), item.getBook().getStockQuantity()));
                    cartService.addItem(email, req);
                    added++;
                } catch (Exception e) {
                    // Skip items that can't be added (out of stock, etc.)
                }
            }
        }

        if (added == 0) {
            throw new BadRequestException(
                    "None of the items from this order are currently available.");
        }

        return cartService.getCart(email);
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}
