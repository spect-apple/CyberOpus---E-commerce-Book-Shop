package com.cyberopus;

import com.cyberopus.entity.Book;
import com.cyberopus.entity.Cart;
import com.cyberopus.entity.Category;
import com.cyberopus.entity.Order;
import com.cyberopus.entity.OrderItem;
import com.cyberopus.entity.Payment;
import com.cyberopus.entity.RewardPoints;
import com.cyberopus.entity.User;
import com.cyberopus.enums.OrderStatus;
import com.cyberopus.enums.PaymentStatus;
import com.cyberopus.enums.Role;
import com.cyberopus.repository.*;
import com.cyberopus.security.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class OrderControllerTest {

    @Autowired MockMvc mockMvc;
    @Autowired UserRepository userRepository;
    @Autowired CartRepository cartRepository;
    @Autowired RewardPointsRepository rewardPointsRepository;
    @Autowired OrderRepository orderRepository;
    @Autowired OrderItemRepository orderItemRepository;
    @Autowired PaymentRepository paymentRepository;
    @Autowired BookRepository bookRepository;
    @Autowired CategoryRepository categoryRepository;
    @Autowired AddressRepository addressRepository;
    @Autowired PasswordEncoder passwordEncoder;
    @Autowired JwtUtil jwtUtil;

    private static final String ORDER_EMAIL = "ordertest@example.com";
    private User testUser;
    private String userToken;
    private Book testBook;
    private Order recentOrder;
    private Order oldOrder;

    @BeforeEach
    void setUp() {
        testUser = userRepository.findByEmail(ORDER_EMAIL).orElseGet(() -> {
            User user = User.builder()
                    .email(ORDER_EMAIL)
                    .password(passwordEncoder.encode("TestPass123!"))
                    .firstName("Order").lastName("Test")
                    .role(Role.CUSTOMER).build();
            user = userRepository.save(user);
            cartRepository.save(Cart.builder().user(user).build());
            rewardPointsRepository.save(RewardPoints.builder().user(user).build());
            return user;
        });

        userToken = TestUtils.generateToken(jwtUtil, ORDER_EMAIL, "CUSTOMER");

        // Create book
        Category cat = categoryRepository.findByName("Fiction")
                .orElseGet(() -> categoryRepository.save(
                        Category.builder().name("OrderTestCat").build()));
        testBook = Book.builder()
                .title("Order Test Book " + System.nanoTime())
                .author("Author")
                .price(new BigDecimal("20.00"))
                .stockQuantity(10)
                .active(true)
                .salesCount(5L)
                .category(cat)
                .build();
        testBook = bookRepository.save(testBook);

        // Create a recent (cancellable) order
        recentOrder = createOrder(testUser, testBook, LocalDateTime.now().minusHours(1), OrderStatus.CONFIRMED);

        // Create an old (non-cancellable) order
        oldOrder = createOrder(testUser, testBook, LocalDateTime.now().minusDays(5), OrderStatus.CONFIRMED);
    }

    private Order createOrder(User user, Book book, LocalDateTime placedAt, OrderStatus status) {
        Order order = Order.builder()
                .user(user)
                .status(status)
                .subtotal(book.getPrice())
                .deliveryCharge(new BigDecimal("4.99"))
                .discount(BigDecimal.ZERO)
                .total(book.getPrice().add(new BigDecimal("4.99")))
                .rewardPointsEarned(0)
                .rewardPointsRedeemed(0)
                .snapshotFullName("Order Test")
                .snapshotLine1("123 Main St")
                .snapshotCity("City")
                .snapshotState("ST")
                .snapshotPostalCode("12345")
                .snapshotCountry("US")
                .snapshotPhone("+1-555-0000")
                .placedAt(placedAt)
                .items(new ArrayList<>())
                .build();
        order = orderRepository.save(order);

        OrderItem item = OrderItem.builder()
                .order(order)
                .book(book)
                .quantity(1)
                .unitPrice(book.getPrice())
                .totalPrice(book.getPrice())
                .bookTitle(book.getTitle())
                .bookAuthor(book.getAuthor())
                .build();
        orderItemRepository.save(item);

        Payment payment = Payment.builder()
                .order(order)
                .status(PaymentStatus.SUCCESS)
                .cardHolderName("Test User")
                .maskedCardNumber("****1234")
                .amount(order.getTotal())
                .processedAt(placedAt)
                .build();
        paymentRepository.save(payment);

        return order;
    }

    @Test
    void testGetOrders() throws Exception {
        mockMvc.perform(get("/api/orders")
                        .header("Authorization", TestUtils.bearerToken(userToken)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray())
                .andExpect(jsonPath("$.totalElements").isNumber());
    }

    @Test
    void testGetOrderById() throws Exception {
        mockMvc.perform(get("/api/orders/" + recentOrder.getId())
                        .header("Authorization", TestUtils.bearerToken(userToken)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(recentOrder.getId()))
                .andExpect(jsonPath("$.status").value("CONFIRMED"));
    }

    @Test
    void testCancelOrderWithin48Hours() throws Exception {
        mockMvc.perform(post("/api/orders/" + recentOrder.getId() + "/cancel")
                        .header("Authorization", TestUtils.bearerToken(userToken)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("CANCELLED"));
    }

    @Test
    void testCancelOrderAfter48HoursRejected() throws Exception {
        mockMvc.perform(post("/api/orders/" + oldOrder.getId() + "/cancel")
                        .header("Authorization", TestUtils.bearerToken(userToken)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testBuyAgain() throws Exception {
        mockMvc.perform(post("/api/orders/" + recentOrder.getId() + "/buy-again")
                        .header("Authorization", TestUtils.bearerToken(userToken)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.itemCount").value(org.hamcrest.Matchers.greaterThan(0)));
    }

    @Test
    void testOrdersRequireAuth() throws Exception {
        mockMvc.perform(get("/api/orders"))
                .andExpect(status().isForbidden());
    }
}
