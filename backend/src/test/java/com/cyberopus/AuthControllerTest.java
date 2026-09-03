package com.cyberopus;

import com.cyberopus.dto.request.LoginRequest;
import com.cyberopus.dto.request.RegisterRequest;
import com.cyberopus.entity.Cart;
import com.cyberopus.entity.RewardPoints;
import com.cyberopus.entity.User;
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

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class AuthControllerTest {

    @Autowired MockMvc mockMvc;
    @Autowired ObjectMapper objectMapper;
    @Autowired UserRepository userRepository;
    @Autowired CartRepository cartRepository;
    @Autowired RewardPointsRepository rewardPointsRepository;
    @Autowired PasswordEncoder passwordEncoder;
    @Autowired JwtUtil jwtUtil;

    private static final String AUTH_EMAIL = "authtest@example.com";
    private static final String AUTH_PASSWORD = "TestPass123!";

    @BeforeEach
    void cleanUp() {
        userRepository.findByEmail(AUTH_EMAIL).ifPresent(u -> {
            cartRepository.findByUserId(u.getId()).ifPresent(c -> cartRepository.deleteById(c.getId()));
            rewardPointsRepository.findByUserId(u.getId()).ifPresent(r -> rewardPointsRepository.deleteById(r.getId()));
            userRepository.deleteById(u.getId());
        });
    }

    @Test
    void testRegisterSuccess() throws Exception {
        RegisterRequest req = new RegisterRequest();
        req.setFirstName("Auth");
        req.setLastName("Test");
        req.setEmail(AUTH_EMAIL);
        req.setPassword(AUTH_PASSWORD);

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.token").exists())
                .andExpect(jsonPath("$.user.email").value(AUTH_EMAIL))
                .andExpect(jsonPath("$.user.role").value("CUSTOMER"));
    }

    @Test
    void testRegisterDuplicateEmail() throws Exception {
        User user = User.builder()
                .email(AUTH_EMAIL)
                .password(passwordEncoder.encode(AUTH_PASSWORD))
                .firstName("Auth").lastName("Test")
                .role(Role.CUSTOMER).build();
        user = userRepository.save(user);
        Cart cart = Cart.builder().user(user).build();
        cartRepository.save(cart);
        RewardPoints rp = RewardPoints.builder().user(user).build();
        rewardPointsRepository.save(rp);

        RegisterRequest req = new RegisterRequest();
        req.setFirstName("Auth");
        req.setLastName("Test");
        req.setEmail(AUTH_EMAIL);
        req.setPassword(AUTH_PASSWORD);

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isConflict());
    }

    @Test
    void testLoginSuccess() throws Exception {
        User user = User.builder()
                .email(AUTH_EMAIL)
                .password(passwordEncoder.encode(AUTH_PASSWORD))
                .firstName("Auth").lastName("Test")
                .role(Role.CUSTOMER).build();
        user = userRepository.save(user);
        Cart cart = Cart.builder().user(user).build();
        cartRepository.save(cart);
        RewardPoints rp = RewardPoints.builder().user(user).build();
        rewardPointsRepository.save(rp);

        LoginRequest req = new LoginRequest();
        req.setEmail(AUTH_EMAIL);
        req.setPassword(AUTH_PASSWORD);

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists())
                .andExpect(jsonPath("$.user.email").value(AUTH_EMAIL));
    }

    @Test
    void testLoginBadCredentials() throws Exception {
        LoginRequest req = new LoginRequest();
        req.setEmail(AUTH_EMAIL);
        req.setPassword("WrongPassword!");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void testGetMeAuthenticated() throws Exception {
        User user = User.builder()
                .email(AUTH_EMAIL)
                .password(passwordEncoder.encode(AUTH_PASSWORD))
                .firstName("Auth").lastName("Test")
                .role(Role.CUSTOMER).build();
        user = userRepository.save(user);
        Cart cart = Cart.builder().user(user).build();
        cartRepository.save(cart);
        RewardPoints rp = RewardPoints.builder().user(user).build();
        rewardPointsRepository.save(rp);

        String token = TestUtils.generateToken(jwtUtil, AUTH_EMAIL, "CUSTOMER");

        mockMvc.perform(get("/api/auth/me")
                        .header("Authorization", TestUtils.bearerToken(token)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value(AUTH_EMAIL));
    }

    @Test
    void testGetMeUnauthenticated() throws Exception {
        mockMvc.perform(get("/api/auth/me"))
                .andExpect(status().isUnauthorized());
    }
}
