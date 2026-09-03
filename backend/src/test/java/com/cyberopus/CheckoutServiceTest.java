package com.cyberopus;

import com.cyberopus.dto.request.CheckoutRequest;
import com.cyberopus.dto.response.CheckoutResponse;
import com.cyberopus.entity.*;
import com.cyberopus.enums.OrderStatus;
import com.cyberopus.enums.PaymentStatus;
import com.cyberopus.enums.Role;
import com.cyberopus.repository.*;
import com.cyberopus.service.CheckoutService;
import com.cyberopus.repository.RewardPointTransactionRepository;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class CheckoutServiceTest {

    @Autowired CheckoutService checkoutService;
    @Autowired UserRepository userRepository;
    @Autowired CartRepository cartRepository;
    @Autowired CartItemRepository cartItemRepository;
    @Autowired RewardPointsRepository rewardPointsRepository;
    @Autowired AddressRepository addressRepository;
    @Autowired BookRepository bookRepository;
    @Autowired OrderRepository orderRepository;
    @Autowired PaymentRepository paymentRepository;
    @Autowired CategoryRepository categoryRepository;
    @Autowired RewardPointTransactionRepository rewardPointTransactionRepository;
    @Autowired PasswordEncoder passwordEncoder;

    private static final String CO_EMAIL = "checkout.test@example.com";
    private User testUser;
    private Book testBook;
    private Address testAddress;

    @BeforeEach
    void setUp() {
        userRepository.findByEmail(CO_EMAIL).ifPresent(u -> {
            Long uid = u.getId();
            // Delete orders (and their payments/items/reward-txns - cascade)
            orderRepository.findByUserId(uid).forEach(o -> {
                rewardPointTransactionRepository.findByOrderId(o.getId())
                        .forEach(t -> rewardPointTransactionRepository.deleteById(t.getId()));
                paymentRepository.findByOrderId(o.getId()).ifPresent(p -> paymentRepository.deleteById(p.getId()));
                orderRepository.deleteById(o.getId());
            });
            cartRepository.findByUserId(uid).ifPresent(c -> {
                cartItemRepository.deleteByCartId(c.getId());
                cartRepository.deleteById(c.getId());
            });
            addressRepository.findByUserId(uid).forEach(a -> addressRepository.deleteById(a.getId()));
            rewardPointsRepository.findByUserId(uid).ifPresent(r -> rewardPointsRepository.deleteById(r.getId()));
            userRepository.deleteById(uid);
        });

        testUser = userRepository.save(User.builder()
                .email(CO_EMAIL)
                .password(passwordEncoder.encode("TestPass123!"))
                .firstName("Checkout").lastName("Test")
                .role(Role.CUSTOMER).build());

        cartRepository.save(Cart.builder().user(testUser).build());
        rewardPointsRepository.save(RewardPoints.builder().user(testUser).build());

        Category category = categoryRepository.findByName("Fiction")
                .orElseGet(() -> categoryRepository.save(Category.builder().name("CO-Fiction").build()));
        testBook = bookRepository.save(Book.builder()
                .title("Checkout Test Book " + System.nanoTime())
                .author("Author")
                .price(new BigDecimal("25.00"))
                .stockQuantity(20)
                .active(true)
                .salesCount(0L)
                .category(category)
                .build());

        testAddress = addressRepository.save(Address.builder()
                .user(testUser)
                .fullName("Checkout Test")
                .phoneNumber("+1-555-0000")
                .line1("456 Test Avenue")
                .city("Test City")
                .state("TC")
                .postalCode("12345")
                .country("US")
                .isDefault(true)
                .build());
    }

    private void addBookToCart(int quantity) {
        Cart cart = cartRepository.findByUserId(testUser.getId()).orElseThrow();
        cartItemRepository.save(CartItem.builder()
                .cart(cart)
                .book(testBook)
                .quantity(quantity)
                .priceAtAdd(testBook.getPrice())
                .addedAt(LocalDateTime.now())
                .build());
    }

    @Test
    void testSuccessfulCheckout() {
        addBookToCart(2);
        CheckoutRequest req = buildRequest("Alice Test", "4242424242424242");

        CheckoutResponse response = checkoutService.checkout(req, CO_EMAIL);

        assertThat(response.getOrder().getStatus()).isEqualTo(OrderStatus.CONFIRMED);
        assertThat(response.getPayment().getStatus()).isEqualTo(PaymentStatus.SUCCESS);
        assertThat(response.getOrder().getSubtotal())
                .isEqualByComparingTo(testBook.getPrice().multiply(BigDecimal.valueOf(2)));
        assertThat(response.getPayment().getMaskedCardNumber()).isEqualTo("****4242");
    }

    @Test
    void testFailTestPayment() {
        addBookToCart(1);
        CheckoutRequest req = buildRequest("FAIL_TEST", "4111111111111111");

        CheckoutResponse response = checkoutService.checkout(req, CO_EMAIL);

        assertThat(response.getOrder().getStatus()).isEqualTo(OrderStatus.PENDING);
        assertThat(response.getPayment().getStatus()).isEqualTo(PaymentStatus.FAILED);

        // Cart preserved on failure
        Cart cart = cartRepository.findByUserId(testUser.getId()).orElseThrow();
        assertThat(cartItemRepository.findAll().stream()
                .anyMatch(ci -> ci.getCart().getId().equals(cart.getId()))).isTrue();
    }

    @Test
    void testInsufficientStock() {
        testBook.setStockQuantity(2);
        bookRepository.save(testBook);
        addBookToCart(5);

        assertThatThrownBy(() -> checkoutService.checkout(buildRequest("Valid User", "4242424242424242"), CO_EMAIL))
                .isInstanceOf(com.cyberopus.exception.InsufficientStockException.class);
    }

    @Test
    void testRewardPointsApplied() {
        RewardPoints rp = rewardPointsRepository.findByUserId(testUser.getId()).orElseThrow();
        rp.setBalance(500);
        rp.setTotalEarned(500);
        rewardPointsRepository.save(rp);
        addBookToCart(1);

        CheckoutRequest req = buildRequest("Alice Test", "4242424242424242");
        req.setRewardPointsToRedeem(100);

        CheckoutResponse response = checkoutService.checkout(req, CO_EMAIL);

        assertThat(response.getOrder().getStatus()).isEqualTo(OrderStatus.CONFIRMED);
        assertThat(response.getOrder().getRewardPointsRedeemed()).isEqualTo(100);
        assertThat(response.getOrder().getDiscount()).isEqualByComparingTo(new BigDecimal("1.00"));
    }

    @Test
    void testCheckoutEmptyCartFails() {
        assertThatThrownBy(() -> checkoutService.checkout(buildRequest("Valid User", "4242424242424242"), CO_EMAIL))
                .isInstanceOf(com.cyberopus.exception.BadRequestException.class)
                .hasMessageContaining("empty");
    }

    private CheckoutRequest buildRequest(String cardHolder, String cardNumber) {
        CheckoutRequest req = new CheckoutRequest();
        req.setAddressId(testAddress.getId());
        req.setCardHolderName(cardHolder);
        req.setCardNumber(cardNumber);
        req.setExpiryMonth(12);
        req.setExpiryYear(2028);
        return req;
    }
}
