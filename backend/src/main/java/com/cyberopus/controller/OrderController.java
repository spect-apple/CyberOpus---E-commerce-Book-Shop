package com.cyberopus.controller;

import com.cyberopus.dto.response.CartResponse;
import com.cyberopus.dto.response.OrderResponse;
import com.cyberopus.dto.response.PageResponse;
import com.cyberopus.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@Tag(name = "Orders", description = "View and manage orders")
@SecurityRequirement(name = "BearerAuth")
public class OrderController {

    private final OrderService orderService;

    @GetMapping
    @Operation(summary = "Get paginated order history for current user")
    public ResponseEntity<PageResponse<OrderResponse>> getOrders(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(orderService.findAllForUser(userDetails.getUsername(), page, size));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a single order by ID")
    public ResponseEntity<OrderResponse> getOrderById(@AuthenticationPrincipal UserDetails userDetails,
                                                       @PathVariable Long id) {
        return ResponseEntity.ok(orderService.findById(id, userDetails.getUsername()));
    }

    @PostMapping("/{id}/cancel")
    @Operation(summary = "Cancel an order (within 48 hours)")
    public ResponseEntity<OrderResponse> cancelOrder(@AuthenticationPrincipal UserDetails userDetails,
                                                      @PathVariable Long id) {
        return ResponseEntity.ok(orderService.cancel(id, userDetails.getUsername()));
    }

    @PostMapping("/{orderId}/buy-again")
    @Operation(summary = "Add all items from a past order to the current cart")
    public ResponseEntity<CartResponse> buyAgain(@AuthenticationPrincipal UserDetails userDetails,
                                                  @PathVariable Long orderId) {
        return ResponseEntity.ok(orderService.buyAgain(orderId, userDetails.getUsername()));
    }
}
