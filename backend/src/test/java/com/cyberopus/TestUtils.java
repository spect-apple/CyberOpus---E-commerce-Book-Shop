package com.cyberopus;

import com.cyberopus.entity.*;
import com.cyberopus.enums.Role;
import com.cyberopus.repository.*;
import com.cyberopus.security.JwtUtil;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.util.List;

public class TestUtils {

    public static final String CUSTOMER_EMAIL = "test.customer@example.com";
    public static final String ADMIN_EMAIL = "test.admin@example.com";
    public static final String TEST_PASSWORD = "TestPass123!";

    public static com.cyberopus.entity.User createTestUser(UserRepository userRepository,
                                                             CartRepository cartRepository,
                                                             RewardPointsRepository rewardPointsRepository,
                                                             PasswordEncoder encoder,
                                                             String email, Role role) {
        com.cyberopus.entity.User user = com.cyberopus.entity.User.builder()
                .email(email)
                .password(encoder.encode(TEST_PASSWORD))
                .firstName("Test")
                .lastName("User")
                .role(role)
                .build();
        user = userRepository.save(user);

        Cart cart = Cart.builder().user(user).build();
        cartRepository.save(cart);

        RewardPoints rp = RewardPoints.builder().user(user).build();
        rewardPointsRepository.save(rp);

        return user;
    }

    public static Book createTestBook(BookRepository bookRepository, Category category, Brand brand) {
        Book book = Book.builder()
                .title("Test Book " + System.nanoTime())
                .author("Test Author")
                .description("A test book description")
                .price(new BigDecimal("19.99"))
                .stockQuantity(10)
                .isbn("978-TEST-0001")
                .active(true)
                .salesCount(100L)
                .category(category)
                .brand(brand)
                .build();
        return bookRepository.save(book);
    }

    public static String generateToken(JwtUtil jwtUtil, String email, String role) {
        UserDetails userDetails = new User(
                email, "password",
                List.of(new SimpleGrantedAuthority("ROLE_" + role)));
        return jwtUtil.generateToken(userDetails);
    }

    public static String bearerToken(String token) {
        return "Bearer " + token;
    }
}
