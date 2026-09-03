package com.cyberopus;

import com.cyberopus.dto.request.BookRequest;
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

import java.math.BigDecimal;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class BookControllerTest {

    @Autowired MockMvc mockMvc;
    @Autowired ObjectMapper objectMapper;
    @Autowired BookRepository bookRepository;
    @Autowired CategoryRepository categoryRepository;
    @Autowired BrandRepository brandRepository;
    @Autowired UserRepository userRepository;
    @Autowired CartRepository cartRepository;
    @Autowired RewardPointsRepository rewardPointsRepository;
    @Autowired PasswordEncoder passwordEncoder;
    @Autowired JwtUtil jwtUtil;

    private Book testBook;
    private String customerToken;
    private String adminToken;

    @BeforeEach
    void setUp() {
        // Get an existing category/brand from seed data, or create test ones
        Category category = categoryRepository.findByName("Fiction")
                .orElseGet(() -> categoryRepository.save(
                        Category.builder().name("TestCat-" + System.nanoTime()).build()));

        Brand brand = brandRepository.findByName("Penguin Books")
                .orElseGet(() -> brandRepository.save(
                        Brand.builder().name("TestBrand-" + System.nanoTime()).build()));

        testBook = Book.builder()
                .title("Test Book Controller " + System.nanoTime())
                .author("Test Author")
                .description("A test description")
                .price(new BigDecimal("29.99"))
                .stockQuantity(5)
                .active(true)
                .salesCount(0L)
                .category(category)
                .brand(brand)
                .build();
        testBook = bookRepository.save(testBook);

        // Customer token
        customerToken = TestUtils.generateToken(jwtUtil, "booktest.customer@example.com", "CUSTOMER");

        // Admin token
        adminToken = TestUtils.generateToken(jwtUtil, "booktest.admin@example.com", "ADMIN");

        // Ensure admin user exists in DB for admin operations
        if (!userRepository.existsByEmail("booktest.admin@example.com")) {
            User admin = User.builder()
                    .email("booktest.admin@example.com")
                    .password(passwordEncoder.encode("Admin123!"))
                    .firstName("Admin").lastName("Test")
                    .role(Role.ADMIN).build();
            admin = userRepository.save(admin);
            cartRepository.save(Cart.builder().user(admin).build());
            rewardPointsRepository.save(RewardPoints.builder().user(admin).build());
        }
    }

    @Test
    void testGetAllBooks() throws Exception {
        mockMvc.perform(get("/api/books"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray())
                .andExpect(jsonPath("$.totalElements").isNumber());
    }

    @Test
    void testGetBookById() throws Exception {
        mockMvc.perform(get("/api/books/" + testBook.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(testBook.getId()))
                .andExpect(jsonPath("$.title").value(testBook.getTitle()));
    }

    @Test
    void testGetBookByIdNotFound() throws Exception {
        mockMvc.perform(get("/api/books/99999"))
                .andExpect(status().isNotFound());
    }

    @Test
    void testSearchBooks() throws Exception {
        mockMvc.perform(get("/api/books/search").param("q", "Test Author"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray());
    }

    @Test
    void testGetRelatedBooks() throws Exception {
        mockMvc.perform(get("/api/books/" + testBook.getId() + "/related"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }

    @Test
    void testAdminCreateBook() throws Exception {
        BookRequest req = new BookRequest();
        req.setTitle("New Admin Book");
        req.setAuthor("Admin Author");
        req.setPrice(new BigDecimal("34.99"));
        req.setStockQuantity(20);
        req.setCategoryId(testBook.getCategory().getId());

        mockMvc.perform(post("/api/books")
                        .header("Authorization", TestUtils.bearerToken(adminToken))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.title").value("New Admin Book"));
    }

    @Test
    void testNonAdminCannotCreateBook() throws Exception {
        BookRequest req = new BookRequest();
        req.setTitle("Unauthorized Book");
        req.setAuthor("Some Author");
        req.setPrice(new BigDecimal("10.00"));
        req.setStockQuantity(5);

        mockMvc.perform(post("/api/books")
                        .header("Authorization", TestUtils.bearerToken(customerToken))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isForbidden());
    }

    @Test
    void testFilterBooksByCategory() throws Exception {
        mockMvc.perform(get("/api/books")
                        .param("category", testBook.getCategory().getId().toString()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray());
    }
}
