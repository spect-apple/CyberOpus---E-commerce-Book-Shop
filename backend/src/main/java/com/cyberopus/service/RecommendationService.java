package com.cyberopus.service;

import com.cyberopus.dto.response.BookResponse;
import com.cyberopus.entity.User;
import com.cyberopus.exception.ResourceNotFoundException;
import com.cyberopus.repository.BookRepository;
import com.cyberopus.repository.OrderItemRepository;
import com.cyberopus.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RecommendationService {

    private final BookRepository bookRepository;
    private final OrderItemRepository orderItemRepository;
    private final UserRepository userRepository;
    private final BookService bookService;

    @Transactional(readOnly = true)
    public List<BookResponse> getRecommendations(String email) {
        if (email == null) {
            return getTopSelling();
        }

        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) return getTopSelling();

        List<Long> purchasedBookIds = orderItemRepository.findPurchasedBookIdsByUserId(user.getId());
        List<Long> purchasedCategoryIds = orderItemRepository.findPurchasedCategoryIdsByUserId(user.getId());
        List<Long> purchasedBrandIds = orderItemRepository.findPurchasedBrandIdsByUserId(user.getId());

        if (purchasedCategoryIds.isEmpty() && purchasedBrandIds.isEmpty()) {
            return getTopSelling();
        }

        Pageable pageable = PageRequest.of(0, 20);
        List<Long> excludeIds = purchasedBookIds.isEmpty()
                ? Collections.singletonList(-1L) : purchasedBookIds;

        // Books in purchased categories not yet bought
        List<BookResponse> recommendations = bookRepository
                .findByCategoryIdInAndIdNotInAndActiveTrueAndStockQuantityGreaterThan(
                        purchasedCategoryIds.isEmpty()
                                ? Collections.singletonList(-1L) : purchasedCategoryIds,
                        excludeIds, 0, pageable)
                .stream()
                .map(bookService::mapToBookResponse)
                .collect(Collectors.toList());

        // Also add books from purchased brands
        if (recommendations.size() < 10 && !purchasedBrandIds.isEmpty()) {
            List<Long> alreadyIncluded = recommendations.stream()
                    .map(BookResponse::getId).collect(Collectors.toList());
            alreadyIncluded.addAll(excludeIds);

            bookRepository.findByBrandIdInAndIdNotInAndActiveTrueAndStockQuantityGreaterThan(
                            purchasedBrandIds, alreadyIncluded, 0,
                            PageRequest.of(0, 10 - recommendations.size()))
                    .stream()
                    .map(bookService::mapToBookResponse)
                    .forEach(recommendations::add);
        }

        return recommendations.isEmpty() ? getTopSelling() : recommendations;
    }

    private List<BookResponse> getTopSelling() {
        return bookRepository.findTop20ByActiveTrueAndStockQuantityGreaterThanOrderBySalesCountDesc(0)
                .stream()
                .map(bookService::mapToBookResponse)
                .collect(Collectors.toList());
    }
}
