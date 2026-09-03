package com.cyberopus.config;

import com.cyberopus.entity.*;
import com.cyberopus.enums.OrderStatus;
import com.cyberopus.enums.PaymentStatus;
import com.cyberopus.enums.Role;
import com.cyberopus.enums.TransactionType;
import com.cyberopus.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements ApplicationRunner {

    private final UserRepository userRepository;
    private final CartRepository cartRepository;
    private final RewardPointsRepository rewardPointsRepository;
    private final AddressRepository addressRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final PaymentRepository paymentRepository;
    private final RewardPointTransactionRepository rewardPointTransactionRepository;
    private final BookRepository bookRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        log.info("Checking demo data...");
        createDemoUsers();
        log.info("Demo data check complete.");
    }

    private void createDemoUsers() {
        if (!userRepository.existsByEmail("alice@demo.com")) {
            User alice = User.builder()
                    .email("alice@demo.com")
                    .password(passwordEncoder.encode("Password123!"))
                    .firstName("Alice")
                    .lastName("Johnson")
                    .role(Role.CUSTOMER)
                    .build();
            alice = userRepository.save(alice);
            setupUserExtras(alice);
            createSampleOrderForUser(alice);
            log.info("Created demo user: alice@demo.com");
        }

        if (!userRepository.existsByEmail("bob@demo.com")) {
            User bob = User.builder()
                    .email("bob@demo.com")
                    .password(passwordEncoder.encode("Password123!"))
                    .firstName("Bob")
                    .lastName("Smith")
                    .role(Role.CUSTOMER)
                    .build();
            bob = userRepository.save(bob);
            setupUserExtras(bob);
            log.info("Created demo user: bob@demo.com");
        }

        if (!userRepository.existsByEmail("admin@cyberopus.com")) {
            User admin = User.builder()
                    .email("admin@cyberopus.com")
                    .password(passwordEncoder.encode("Admin123!"))
                    .firstName("System")
                    .lastName("Admin")
                    .role(Role.ADMIN)
                    .build();
            admin = userRepository.save(admin);
            setupUserExtras(admin);
            log.info("Created demo user: admin@cyberopus.com");
        }
    }

    private void setupUserExtras(User user) {
        // Create cart for user
        Cart cart = Cart.builder().user(user).build();
        cartRepository.save(cart);

        // Create reward points for user
        RewardPoints rp = RewardPoints.builder().user(user).build();
        rewardPointsRepository.save(rp);
    }

    private void createSampleOrderForUser(User alice) {
        // Get first available book for sample order
        List<Book> books = bookRepository.findTop10ByActiveTrueOrderBySalesCountDesc();
        if (books.isEmpty()) return;

        Book book = books.get(0);

        // Create address for alice
        Address address = Address.builder()
                .user(alice)
                .fullName("Alice Johnson")
                .phoneNumber("+1-555-0101")
                .line1("123 Main Street")
                .city("New York")
                .state("NY")
                .postalCode("10001")
                .country("US")
                .isDefault(true)
                .build();
        address = addressRepository.save(address);

        // Create sample confirmed order
        BigDecimal unitPrice = book.getPrice();
        BigDecimal subtotal = unitPrice;
        BigDecimal deliveryCharge = new BigDecimal("4.99");
        BigDecimal total = subtotal.add(deliveryCharge);
        int pointsEarned = (int)(total.doubleValue() * 10); // earn rate = 10

        Order order = Order.builder()
                .user(alice)
                .status(OrderStatus.CONFIRMED)
                .subtotal(subtotal)
                .deliveryCharge(deliveryCharge)
                .discount(BigDecimal.ZERO)
                .total(total)
                .rewardPointsEarned(pointsEarned)
                .rewardPointsRedeemed(0)
                .snapshotFullName(address.getFullName())
                .snapshotLine1(address.getLine1())
                .snapshotCity(address.getCity())
                .snapshotState(address.getState())
                .snapshotPostalCode(address.getPostalCode())
                .snapshotCountry(address.getCountry())
                .snapshotPhone(address.getPhoneNumber())
                .placedAt(LocalDateTime.now().minusDays(10))
                .build();
        order = orderRepository.save(order);

        // Create order item
        OrderItem item = OrderItem.builder()
                .order(order)
                .book(book)
                .quantity(1)
                .unitPrice(unitPrice)
                .totalPrice(unitPrice)
                .bookTitle(book.getTitle())
                .bookAuthor(book.getAuthor())
                .build();
        orderItemRepository.save(item);

        // Create payment
        Payment payment = Payment.builder()
                .order(order)
                .status(PaymentStatus.SUCCESS)
                .cardHolderName("Alice Johnson")
                .maskedCardNumber("****4242")
                .amount(total)
                .processedAt(order.getPlacedAt())
                .build();
        paymentRepository.save(payment);

        // Create reward points transaction
        RewardPoints rp = rewardPointsRepository.findByUserId(alice.getId()).orElseThrow();
        rp.setBalance(pointsEarned);
        rp.setTotalEarned(pointsEarned);
        rewardPointsRepository.save(rp);

        RewardPointTransaction txn = RewardPointTransaction.builder()
                .rewardPoints(rp)
                .type(TransactionType.EARNED)
                .points(pointsEarned)
                .description("Points earned for order #" + order.getId())
                .order(order)
                .build();
        rewardPointTransactionRepository.save(txn);

        // Update book sales count
        book.setSalesCount(book.getSalesCount() + 1);
        bookRepository.save(book);

        log.info("Created sample order for alice (Order ID: {})", order.getId());
    }
}
