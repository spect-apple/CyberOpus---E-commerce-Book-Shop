package com.cyberopus.controller;

import com.cyberopus.dto.response.PaymentResponse;
import com.cyberopus.entity.Payment;
import com.cyberopus.entity.User;
import com.cyberopus.exception.ResourceNotFoundException;
import com.cyberopus.repository.PaymentRepository;
import com.cyberopus.repository.UserRepository;
import com.cyberopus.service.CheckoutService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@Tag(name = "Payments", description = "View payment information")
@SecurityRequirement(name = "BearerAuth")
public class PaymentController {

    private final PaymentRepository paymentRepository;
    private final UserRepository userRepository;
    private final CheckoutService checkoutService;

    @GetMapping("/order/{orderId}")
    @Operation(summary = "Get payment details for an order (must be your own order)")
    public ResponseEntity<PaymentResponse> getPaymentByOrderId(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long orderId) {

        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Payment payment = paymentRepository.findByOrderIdAndOrderUserId(orderId, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Payment not found for order: " + orderId));

        return ResponseEntity.ok(checkoutService.mapToPaymentResponse(payment));
    }
}
