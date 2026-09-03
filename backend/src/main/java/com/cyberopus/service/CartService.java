package com.cyberopus.service;

import com.cyberopus.config.AppProperties;
import com.cyberopus.dto.request.CartItemRequest;
import com.cyberopus.dto.request.UpdateCartItemRequest;
import com.cyberopus.dto.response.CartItemResponse;
import com.cyberopus.dto.response.CartResponse;
import com.cyberopus.entity.Book;
import com.cyberopus.entity.Cart;
import com.cyberopus.entity.CartItem;
import com.cyberopus.entity.User;
import com.cyberopus.exception.BadRequestException;
import com.cyberopus.exception.ForbiddenException;
import com.cyberopus.exception.InsufficientStockException;
import com.cyberopus.exception.ResourceNotFoundException;
import com.cyberopus.repository.BookRepository;
import com.cyberopus.repository.CartItemRepository;
import com.cyberopus.repository.CartRepository;
import com.cyberopus.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;
    private final BookService bookService;
    private final AppProperties appProperties;

    @Transactional(readOnly = true)
    public CartResponse getCart(String email) {
        User user = getUser(email);
        Cart cart = getOrCreateCart(user);
        return mapToCartResponse(cart);
    }

    @Transactional
    public CartResponse addItem(String email, CartItemRequest request) {
        User user = getUser(email);
        Cart cart = getOrCreateCart(user);
        Book book = bookRepository.findById(request.getBookId())
                .orElseThrow(() -> new ResourceNotFoundException("Book", request.getBookId()));

        if (!book.getActive()) throw new BadRequestException("Book is not available");

        int requested = request.getQuantity();
        if (book.getStockQuantity() < requested) {
            throw new InsufficientStockException(
                    "Only " + book.getStockQuantity() + " copies available for: " + book.getTitle());
        }

        // Check if already in cart
        CartItem existingItem = cart.getItems().stream()
                .filter(ci -> ci.getBook().getId().equals(book.getId()))
                .findFirst().orElse(null);

        if (existingItem != null) {
            int newQty = existingItem.getQuantity() + requested;
            if (book.getStockQuantity() < newQty) {
                throw new InsufficientStockException(
                        "Only " + book.getStockQuantity() + " copies available for: " + book.getTitle());
            }
            existingItem.setQuantity(newQty);
            cartItemRepository.save(existingItem);
        } else {
            CartItem cartItem = CartItem.builder()
                    .cart(cart)
                    .book(book)
                    .quantity(requested)
                    .priceAtAdd(book.getPrice())
                    .addedAt(LocalDateTime.now())
                    .build();
            cart.getItems().add(cartItem);
            cartItemRepository.save(cartItem);
        }

        cartRepository.save(cart);
        return mapToCartResponse(cartRepository.findByUserId(user.getId()).orElseThrow());
    }

    @Transactional
    public CartResponse updateItem(String email, Long itemId, UpdateCartItemRequest request) {
        User user = getUser(email);
        Cart cart = getOrCreateCart(user);
        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item", itemId));

        if (!item.getCart().getId().equals(cart.getId())) {
            throw new ForbiddenException("Cart item does not belong to your cart");
        }

        Book book = item.getBook();
        if (book.getStockQuantity() < request.getQuantity()) {
            throw new InsufficientStockException(
                    "Only " + book.getStockQuantity() + " copies available for: " + book.getTitle());
        }

        item.setQuantity(request.getQuantity());
        cartItemRepository.save(item);
        return mapToCartResponse(cartRepository.findByUserId(user.getId()).orElseThrow());
    }

    @Transactional
    public CartResponse removeItem(String email, Long itemId) {
        User user = getUser(email);
        Cart cart = getOrCreateCart(user);
        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item", itemId));

        if (!item.getCart().getId().equals(cart.getId())) {
            throw new ForbiddenException("Cart item does not belong to your cart");
        }

        cart.getItems().remove(item);
        cartItemRepository.delete(item);
        cartRepository.save(cart);
        return mapToCartResponse(cartRepository.findByUserId(user.getId()).orElseThrow());
    }

    @Transactional
    public void clearCart(String email) {
        User user = getUser(email);
        Cart cart = cartRepository.findByUserId(user.getId()).orElse(null);
        if (cart != null) {
            cart.getItems().clear();
            cartRepository.save(cart);
        }
    }

    public CartResponse mapToCartResponse(Cart cart) {
        List<CartItemResponse> itemResponses = cart.getItems().stream()
                .map(this::mapToCartItemResponse)
                .collect(Collectors.toList());

        BigDecimal subtotal = itemResponses.stream()
                .map(ci -> ci.getCurrentPrice().multiply(BigDecimal.valueOf(ci.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal deliveryCharge = subtotal.compareTo(BigDecimal.ZERO) > 0
                ? appProperties.getDeliveryCharge()
                : BigDecimal.ZERO;

        BigDecimal total = subtotal.add(deliveryCharge);
        int itemCount = itemResponses.stream().mapToInt(CartItemResponse::getQuantity).sum();
        boolean hasPriceChanges = itemResponses.stream().anyMatch(CartItemResponse::getPriceChanged);

        return CartResponse.builder()
                .items(itemResponses)
                .subtotal(subtotal)
                .deliveryCharge(deliveryCharge)
                .total(total)
                .itemCount(itemCount)
                .hasPriceChanges(hasPriceChanges)
                .build();
    }

    private CartItemResponse mapToCartItemResponse(CartItem item) {
        BigDecimal currentPrice = item.getBook().getPrice();
        boolean priceChanged = item.getPriceAtAdd().compareTo(currentPrice) != 0;
        return CartItemResponse.builder()
                .id(item.getId())
                .book(bookService.mapToBookResponse(item.getBook()))
                .quantity(item.getQuantity())
                .priceAtAdd(item.getPriceAtAdd())
                .currentPrice(currentPrice)
                .priceChanged(priceChanged)
                .addedAt(item.getAddedAt())
                .build();
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private Cart getOrCreateCart(User user) {
        return cartRepository.findByUserId(user.getId()).orElseGet(() -> {
            Cart cart = Cart.builder().user(user).build();
            return cartRepository.save(cart);
        });
    }
}
