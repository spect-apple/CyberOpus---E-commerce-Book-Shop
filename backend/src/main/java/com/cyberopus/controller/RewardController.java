package com.cyberopus.controller;

import com.cyberopus.dto.response.RewardResponse;
import com.cyberopus.service.RewardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/rewards")
@RequiredArgsConstructor
@Tag(name = "Rewards", description = "Reward points balance and transaction history")
@SecurityRequirement(name = "BearerAuth")
public class RewardController {

    private final RewardService rewardService;

    @GetMapping
    @Operation(summary = "Get current user's reward points balance and history")
    public ResponseEntity<RewardResponse> getRewards(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(rewardService.getRewards(userDetails.getUsername()));
    }
}
