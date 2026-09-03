package com.cyberopus;

import com.cyberopus.entity.*;
import com.cyberopus.enums.Role;
import com.cyberopus.enums.TransactionType;
import com.cyberopus.repository.*;
import com.cyberopus.security.JwtUtil;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class RewardControllerTest {

    @Autowired MockMvc mockMvc;
    @Autowired UserRepository userRepository;
    @Autowired CartRepository cartRepository;
    @Autowired RewardPointsRepository rewardPointsRepository;
    @Autowired RewardPointTransactionRepository transactionRepository;
    @Autowired PasswordEncoder passwordEncoder;
    @Autowired JwtUtil jwtUtil;

    private static final String REWARD_EMAIL = "rewardtest@example.com";
    private String userToken;

    @BeforeEach
    void setUp() {
        User user = userRepository.findByEmail(REWARD_EMAIL).orElseGet(() -> {
            User u = User.builder()
                    .email(REWARD_EMAIL)
                    .password(passwordEncoder.encode("TestPass123!"))
                    .firstName("Reward").lastName("Test")
                    .role(Role.CUSTOMER).build();
            u = userRepository.save(u);
            cartRepository.save(Cart.builder().user(u).build());
            return u;
        });

        // Set up reward points
        RewardPoints rp = rewardPointsRepository.findByUserId(user.getId()).orElseGet(() ->
                rewardPointsRepository.save(RewardPoints.builder().user(user).build()));
        rp.setBalance(250);
        rp.setTotalEarned(300);
        rp.setTotalRedeemed(50);
        rp = rewardPointsRepository.save(rp);

        // Add a transaction
        RewardPointTransaction txn = RewardPointTransaction.builder()
                .rewardPoints(rp)
                .type(TransactionType.EARNED)
                .points(300)
                .description("Points earned from test order")
                .build();
        transactionRepository.save(txn);

        userToken = TestUtils.generateToken(jwtUtil, REWARD_EMAIL, "CUSTOMER");
    }

    @Test
    void testGetRewards() throws Exception {
        mockMvc.perform(get("/api/rewards")
                        .header("Authorization", TestUtils.bearerToken(userToken)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.balance").value(250))
                .andExpect(jsonPath("$.totalEarned").value(300))
                .andExpect(jsonPath("$.totalRedeemed").value(50))
                .andExpect(jsonPath("$.transactions").isArray());
    }

    @Test
    void testRewardsRequireAuth() throws Exception {
        mockMvc.perform(get("/api/rewards"))
                .andExpect(status().isForbidden());
    }
}
