package com.cyberopus.service;

import com.cyberopus.dto.response.WishlistResponse;
import com.cyberopus.entity.Book;
import com.cyberopus.entity.User;
import com.cyberopus.entity.Wishlist;
import com.cyberopus.exception.ResourceNotFoundException;
import com.cyberopus.repository.BookRepository;
import com.cyberopus.repository.UserRepository;
import com.cyberopus.repository.WishlistRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WishlistService {

    private final WishlistRepository wishlistRepository;
    private final UserRepository userRepository;
    private final BookRepository bookRepository;
    private final BookService bookService;

    @Transactional(readOnly = true)
    public List<WishlistResponse> getWishlist(String email) {
        User user = getUser(email);
        return wishlistRepository.findByUserIdWithBook(user.getId())
                .stream()
                .map(w -> new WishlistResponse(w.getId(), bookService.mapToBookResponse(w.getBook()), w.getAddedAt()))
                .collect(Collectors.toList());
    }

    @Transactional
    public WishlistResponse add(String email, Long bookId) {
        User user = getUser(email);
        if (wishlistRepository.existsByUserIdAndBookId(user.getId(), bookId)) {
            Wishlist existing = wishlistRepository.findByUserIdAndBookId(user.getId(), bookId).orElseThrow();
            return new WishlistResponse(existing.getId(), bookService.mapToBookResponse(existing.getBook()), existing.getAddedAt());
        }
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new ResourceNotFoundException("Book", bookId));
        Wishlist wishlist = Wishlist.builder().user(user).book(book).build();
        wishlist = wishlistRepository.save(wishlist);
        return new WishlistResponse(wishlist.getId(), bookService.mapToBookResponse(book), wishlist.getAddedAt());
    }

    @Transactional
    public void remove(String email, Long bookId) {
        User user = getUser(email);
        if (!wishlistRepository.existsByUserIdAndBookId(user.getId(), bookId)) {
            throw new ResourceNotFoundException("Wishlist item for book " + bookId, bookId);
        }
        wishlistRepository.deleteByUserIdAndBookId(user.getId(), bookId);
    }

    @Transactional(readOnly = true)
    public boolean isInWishlist(String email, Long bookId) {
        User user = getUser(email);
        return wishlistRepository.existsByUserIdAndBookId(user.getId(), bookId);
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }
}
