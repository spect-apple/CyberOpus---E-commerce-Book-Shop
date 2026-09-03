package com.cyberopus.controller;

import com.cyberopus.dto.response.WishlistResponse;
import com.cyberopus.service.WishlistService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/wishlist")
@RequiredArgsConstructor
@Tag(name = "Wishlist", description = "User wishlist management")
@SecurityRequirement(name = "BearerAuth")
public class WishlistController {

    private final WishlistService wishlistService;

    @GetMapping
    public List<WishlistResponse> getWishlist(@AuthenticationPrincipal UserDetails userDetails) {
        return wishlistService.getWishlist(userDetails.getUsername());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public WishlistResponse add(@AuthenticationPrincipal UserDetails userDetails,
                                @RequestBody Map<String, Long> body) {
        return wishlistService.add(userDetails.getUsername(), body.get("bookId"));
    }

    @DeleteMapping("/{bookId}")
    public ResponseEntity<Void> remove(@AuthenticationPrincipal UserDetails userDetails,
                                       @PathVariable Long bookId) {
        wishlistService.remove(userDetails.getUsername(), bookId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/check/{bookId}")
    public boolean check(@AuthenticationPrincipal UserDetails userDetails,
                         @PathVariable Long bookId) {
        return wishlistService.isInWishlist(userDetails.getUsername(), bookId);
    }
}
