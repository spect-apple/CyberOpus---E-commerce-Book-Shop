package com.cyberopus;

import com.cyberopus.dto.request.CartItemRequest;
import com.cyberopus.dto.request.UpdateCartItemRequest;
import com.cyberopus.entity.*;
import com.cyberopus.enums.Role;
import com.cyberopus.repository.*;
import com.cyberopus.security.JwtUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.math.BigDecimal;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class CartControllerTest {

    @Autowired MockMvc mockMvc;
    @Autowired ObjectMapper objectMapper;
    @Autowired BookRepository bookRepository;
    @Autowired CategoryRepository categoryRepository;
    @Autowired UserRepository userRepository;
    @Autowired CartRepository cartRepository;
    @Autowired CartItemRepository cartItemRepository;
    @Autowired RewardPointsRepository rewardPointsRepository;
    @Autowired PasswordEncoder passwordEncoder;
    @Autowired JwtUtil jwtUtil;

    private static final String CART_USER_EMAIL = "carttest@example.com";
    private String userToken;
    private User testUser;
    private Book testBook;

    @BeforeEach
    void setUp() {
        testUser = userRepository.findByEmail(CART_USER_EMAIL).orElseGet(() -> {
            User user = User.builder()
                    .email(CART_USER_EMAIL)
                    .password(passwordEncoder.encode("TestPass123!"))
                    .firstName("Cart").lastName("Test")
                    .role(Role.CUSTOMER).build();
            user = userRepository.save(user);
            Cart cart = Cart.builder().user(user).build();
            cartRepository.save(cart);
            RewardPoints rp = RewardPoints.builder().user(user).build();
            rewardPointsRepository.save(rp);
            return user;
        });

        userToken = TestUtils.generateToken(jwtUtil, CART_USER_EMAIL, "CUSTOMER");

        // Clear cart items using repository (avoids lazy loading)
        cartRepository.findByUserId(testUser.getId()).ifPresent(cart ->
                cartItemRepository.deleteByCartId(cart.getId()));

        // Create test book
        Category category = categoryRepository.findByName("Fiction")
                .orElseGet(() -> categoryRepository.save(
                        Category.builder().name("CartTestCat").build()));
        testBook = Book.builder()
                .title("Cart Test Book " + System.nanoTime())
                .author("Author")
                .price(new BigDecimal("15.99"))
                .stockQuantity(10)
                .active(true)
                .salesCount(0L)
                .category(category)
                .build();
        testBook = bookRepository.save(testBook);
    }

    @Test
    void testGetEmptyCart() throws Exception {
        mockMvc.perform(get("/api/cart")
                        .header("Authorization", TestUtils.bearerToken(userToken)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.items").isArray())
                .andExpect(jsonPath("$.itemCount").value(0));
    }

    @Test
    void testAddItemToCart() throws Exception {
        CartItemRequest req = new CartItemRequest();
        req.setBookId(testBook.getId());
        req.setQuantity(2);

        mockMvc.perform(post("/api/cart/items")
                        .header("Authorization", TestUtils.bearerToken(userToken))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.items").isArray())
                .andExpect(jsonPath("$.itemCount").value(2));
    }

    @Test
    void testUpdateCartItem() throws Exception {
        CartItemRequest addReq = new CartItemRequest();
        addReq.setBookId(testBook.getId());
        addReq.setQuantity(1);

        MvcResult addResult = mockMvc.perform(post("/api/cart/items")
                        .header("Authorization", TestUtils.bearerToken(userToken))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(addReq)))
                .andReturn();

        Long itemId = objectMapper.readTree(addResult.getResponse().getContentAsString())
                .get("items").get(0).get("id").asLong();

        UpdateCartItemRequest updateReq = new UpdateCartItemRequest();
        updateReq.setQuantity(3);

        mockMvc.perform(put("/api/cart/items/" + itemId)
                        .header("Authorization", TestUtils.bearerToken(userToken))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.itemCount").value(3));
    }

    @Test
    void testRemoveFromCart() throws Exception {
        CartItemRequest addReq = new CartItemRequest();
        addReq.setBookId(testBook.getId());
        addReq.setQuantity(1);

        MvcResult addResult = mockMvc.perform(post("/api/cart/items")
                        .header("Authorization", TestUtils.bearerToken(userToken))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(addReq)))
                .andReturn();

        Long itemId = objectMapper.readTree(addResult.getResponse().getContentAsString())
                .get("items").get(0).get("id").asLong();

        mockMvc.perform(delete("/api/cart/items/" + itemId)
                        .header("Authorization", TestUtils.bearerToken(userToken)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.itemCount").value(0));
    }

    @Test
    void testCartRequiresAuth() throws Exception {
        mockMvc.perform(get("/api/cart"))
                .andExpect(status().isForbidden());
    }
}
