package com.cyberopus.service;

import com.cyberopus.config.AppProperties;
import com.cyberopus.dto.request.CheckoutRequest;
import com.cyberopus.dto.response.CheckoutResponse;
import com.cyberopus.dto.response.OrderItemResponse;
import com.cyberopus.dto.response.OrderResponse;
import com.cyberopus.dto.response.PaymentResponse;
import com.cyberopus.entity.*;
import com.cyberopus.enums.OrderStatus;
import com.cyberopus.enums.PaymentStatus;
import com.cyberopus.exception.BadRequestException;
import com.cyberopus.exception.InsufficientStockException;
import com.cyberopus.exception.ResourceNotFoundException;
import com.cyberopus.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CheckoutService {

    private final UserRepository userRepository;
    private final CartRepository cartRepository;
    private final AddressRepository addressRepository;
    private final BookRepository bookRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final PaymentRepository paymentRepository;
    private final RewardPointsRepository rewardPointsRepository;
    private final RewardService rewardService;
    private final AppProperties appProperties;

    @Transactional
    public CheckoutResponse checkout(CheckoutRequest request, String email) {
        // 1. Get user
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // 2. Get cart
        Cart cart = cartRepository.findByUserId(user.getId())
                .orElseThrow(() -> new BadRequestException("Cart not found"));

        if (cart.getItems().isEmpty()) {
            throw new BadRequestException("Cart is empty. Please add items before checking out.");
        }

        // 3. Get address
        Address address = addressRepository.findByIdAndUserId(request.getAddressId(), user.getId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Address not found or does not belong to you"));

        // 4. Calculate server-side totals using current prices
        BigDecimal subtotal = cart.getItems().stream()
                .map(item -> item.getBook().getPrice()
                        .multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal deliveryCharge = appProperties.getDeliveryCharge();
        BigDecimal discount = BigDecimal.ZERO;
        int pointsToRedeem = request.getRewardPointsToRedeem() != null
                ? request.getRewardPointsToRedeem() : 0;

        // 5. Apply rewards if requested
        if (pointsToRedeem > 0) {
            RewardPoints rewardPoints = rewardPointsRepository.findByUserId(user.getId())
                    .orElseThrow(() -> new BadRequestException("Reward points account not found"));

            if (pointsToRedeem > rewardPoints.getBalance()) {
                throw new BadRequestException("Insufficient reward points. Available: "
                        + rewardPoints.getBalance());
            }

            BigDecimal orderTotalBeforeDiscount = subtotal.add(deliveryCharge);
            BigDecimal maxDiscount = orderTotalBeforeDiscount
                    .multiply(BigDecimal.valueOf(appProperties.getRewardsMaxRedeemPct()))
                    .divide(BigDecimal.valueOf(100), 2, RoundingMode.DOWN);

            BigDecimal requestedDiscount = BigDecimal.valueOf(pointsToRedeem)
                    .divide(BigDecimal.valueOf(appProperties.getRewardsRedeemRate()), 2, RoundingMode.DOWN);

            if (requestedDiscount.compareTo(maxDiscount) > 0) {
                throw new BadRequestException(
                        "Reward points exceed the 20% maximum discount cap for this order. " +
                        "Maximum redeemable: " + maxDiscount.multiply(
                                BigDecimal.valueOf(appProperties.getRewardsRedeemRate()))
                                .setScale(0, RoundingMode.DOWN).toPlainString() + " points");
            }

            discount = requestedDiscount;
        }

        BigDecimal total = subtotal.add(deliveryCharge).subtract(discount);
        if (total.compareTo(BigDecimal.ZERO) < 0) total = BigDecimal.ZERO;

        // 6. Lock books and validate/reduce stock
        List<CartItem> cartItems = new ArrayList<>(cart.getItems());
        for (CartItem cartItem : cartItems) {
            Book book = bookRepository.findByIdWithLock(cartItem.getBook().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Book not found: "
                            + cartItem.getBook().getId()));
            if (book.getStockQuantity() < cartItem.getQuantity()) {
                throw new InsufficientStockException(
                        "Insufficient stock for '" + book.getTitle() + "'. " +
                        "Available: " + book.getStockQuantity() + ", Requested: " + cartItem.getQuantity());
            }
            book.setStockQuantity(book.getStockQuantity() - cartItem.getQuantity());
            bookRepository.save(book);
        }

        // 7. Create Order with address snapshot
        Order order = Order.builder()
                .user(user)
                .status(OrderStatus.PENDING)
                .subtotal(subtotal)
                .deliveryCharge(deliveryCharge)
                .discount(discount)
                .total(total)
                .rewardPointsRedeemed(pointsToRedeem)
                .rewardPointsEarned(0)
                .snapshotFullName(address.getFullName())
                .snapshotLine1(address.getLine1())
                .snapshotLine2(address.getLine2())
                .snapshotCity(address.getCity())
                .snapshotState(address.getState())
                .snapshotPostalCode(address.getPostalCode())
                .snapshotCountry(address.getCountry())
                .snapshotPhone(address.getPhoneNumber())
                .placedAt(LocalDateTime.now())
                .items(new ArrayList<>())
                .build();
        order = orderRepository.save(order);

        // 8. Create OrderItems with price snapshot
        for (CartItem cartItem : cartItems) {
            Book book = cartItem.getBook();
            BigDecimal unitPrice = book.getPrice();
            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .book(book)
                    .quantity(cartItem.getQuantity())
                    .unitPrice(unitPrice)
                    .totalPrice(unitPrice.multiply(BigDecimal.valueOf(cartItem.getQuantity())))
                    .bookTitle(book.getTitle())
                    .bookAuthor(book.getAuthor())
                    .build();
            orderItemRepository.save(orderItem);
            order.getItems().add(orderItem);

            // Update sales count
            book.setSalesCount(book.getSalesCount() + cartItem.getQuantity());
            bookRepository.save(book);
        }

        // 9. Create Payment (initially PENDING)
        String rawCard = request.getCardNumber().replaceAll("[^0-9]", "");
        String lastFour = rawCard.length() >= 4 ? rawCard.substring(rawCard.length() - 4) : rawCard;
        String maskedCard = "****" + lastFour;

        Payment payment = Payment.builder()
                .order(order)
                .status(PaymentStatus.PENDING)
                .cardHolderName(request.getCardHolderName())
                .maskedCardNumber(maskedCard)
                .amount(total)
                .build();

        // 10. Process payment simulation
        if ("FAIL_TEST".equalsIgnoreCase(request.getCardHolderName())) {
            // Restore stock on payment failure
            for (CartItem cartItem : cartItems) {
                Book book = bookRepository.findById(cartItem.getBook().getId()).orElse(null);
                if (book != null) {
                    book.setStockQuantity(book.getStockQuantity() + cartItem.getQuantity());
                    book.setSalesCount(Math.max(0, book.getSalesCount() - cartItem.getQuantity()));
                    bookRepository.save(book);
                }
            }
            payment.setStatus(PaymentStatus.FAILED);
            log.info("Test payment failure simulated for order {}", order.getId());
        } else {
            // Success: confirm order, earn points, clear cart
            payment.setStatus(PaymentStatus.SUCCESS);
            payment.setProcessedAt(LocalDateTime.now());
            order.setStatus(OrderStatus.CONFIRMED);

            // Earn reward points (based on total paid)
            rewardService.earnPoints(user, order, total);

            // Redeem reward points if requested
            if (pointsToRedeem > 0) {
                rewardService.redeemPoints(user, order, pointsToRedeem);
            }

            order = orderRepository.save(order);

            // Clear cart
            cart.getItems().clear();
            cartRepository.save(cart);
        }

        payment = paymentRepository.save(payment);

        return CheckoutResponse.builder()
                .order(mapToOrderResponse(order))
                .payment(mapToPaymentResponse(payment))
                .build();
    }

    public OrderResponse mapToOrderResponse(Order order) {
        List<OrderItemResponse> items = order.getItems() != null
                ? order.getItems().stream().map(this::mapToOrderItemResponse).collect(Collectors.toList())
                : List.of();

        boolean canCancel = (order.getStatus() == OrderStatus.PENDING
                || order.getStatus() == OrderStatus.CONFIRMED)
                && order.getPlacedAt().isAfter(LocalDateTime.now().minusHours(48));

        return OrderResponse.builder()
                .id(order.getId())
                .status(order.getStatus())
                .items(items)
                .subtotal(order.getSubtotal())
                .deliveryCharge(order.getDeliveryCharge())
                .discount(order.getDiscount())
                .total(order.getTotal())
                .rewardPointsEarned(order.getRewardPointsEarned())
                .rewardPointsRedeemed(order.getRewardPointsRedeemed())
                .snapshotFullName(order.getSnapshotFullName())
                .snapshotLine1(order.getSnapshotLine1())
                .snapshotLine2(order.getSnapshotLine2())
                .snapshotCity(order.getSnapshotCity())
                .snapshotState(order.getSnapshotState())
                .snapshotPostalCode(order.getSnapshotPostalCode())
                .snapshotCountry(order.getSnapshotCountry())
                .snapshotPhone(order.getSnapshotPhone())
                .placedAt(order.getPlacedAt())
                .canCancel(canCancel)
                .build();
    }

    private OrderItemResponse mapToOrderItemResponse(OrderItem item) {
        return OrderItemResponse.builder()
                .id(item.getId())
                .bookId(item.getBook() != null ? item.getBook().getId() : null)
                .bookTitle(item.getBookTitle())
                .bookAuthor(item.getBookAuthor())
                .quantity(item.getQuantity())
                .unitPrice(item.getUnitPrice())
                .totalPrice(item.getTotalPrice())
                .build();
    }

    public PaymentResponse mapToPaymentResponse(Payment payment) {
        return PaymentResponse.builder()
                .id(payment.getId())
                .status(payment.getStatus())
                .cardHolderName(payment.getCardHolderName())
                .maskedCardNumber(payment.getMaskedCardNumber())
                .amount(payment.getAmount())
                .processedAt(payment.getProcessedAt())
                .build();
    }
}
