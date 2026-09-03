package com.cyberopus.service;

import com.cyberopus.config.AppProperties;
import com.cyberopus.dto.request.BookRequest;
import com.cyberopus.dto.response.BookResponse;
import com.cyberopus.dto.response.BrandResponse;
import com.cyberopus.dto.response.CategoryResponse;
import com.cyberopus.dto.response.PageResponse;
import com.cyberopus.entity.Book;
import com.cyberopus.entity.Brand;
import com.cyberopus.entity.Category;
import com.cyberopus.exception.ConflictException;
import com.cyberopus.exception.ResourceNotFoundException;
import com.cyberopus.repository.BookRepository;
import com.cyberopus.repository.BrandRepository;
import com.cyberopus.repository.CategoryRepository;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookService {

    private final BookRepository bookRepository;
    private final CategoryRepository categoryRepository;
    private final BrandRepository brandRepository;
    private final AppProperties appProperties;

    @Transactional(readOnly = true)
    public PageResponse<BookResponse> findAll(int page, int size, String sort,
                                               Long categoryId, Long brandId,
                                               BigDecimal minPrice, BigDecimal maxPrice,
                                               String search, Boolean inStock) {
        Sort sortObj = parseSortParam(sort);
        Pageable pageable = PageRequest.of(page, size, sortObj);
        Specification<Book> spec = buildSpec(categoryId, brandId, minPrice, maxPrice, search, inStock);
        Page<Book> bookPage = bookRepository.findAll(spec, pageable);
        return PageResponse.from(bookPage, this::mapToBookResponse);
    }

    @Transactional(readOnly = true)
    public BookResponse findById(Long id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Book", id));
        return mapToBookResponse(book);
    }

    @Transactional(readOnly = true)
    public PageResponse<BookResponse> search(String query, int page, int size) {
        Specification<Book> spec = buildSpec(null, null, null, null, query, null);
        Pageable pageable = PageRequest.of(page, size, Sort.by("salesCount").descending());
        Page<Book> bookPage = bookRepository.findAll(spec, pageable);
        return PageResponse.from(bookPage, this::mapToBookResponse);
    }

    @Transactional(readOnly = true)
    public List<BookResponse> findRelated(Long bookId) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new ResourceNotFoundException("Book", bookId));
        if (book.getCategory() == null) return List.of();
        Pageable pageable = PageRequest.of(0, 6);
        return bookRepository.findByCategoryIdAndIdNotAndActiveTrueOrderBySalesCountDesc(
                        book.getCategory().getId(), bookId, pageable)
                .stream().map(this::mapToBookResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PageResponse<BookResponse> findByCategoryId(Long categoryId, Pageable pageable) {
        categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category", categoryId));
        Page<Book> bookPage = bookRepository.findByCategoryIdAndActiveTrue(categoryId, pageable);
        return PageResponse.from(bookPage, this::mapToBookResponse);
    }

    @Transactional(readOnly = true)
    public PageResponse<BookResponse> findByBrandId(Long brandId, Pageable pageable) {
        brandRepository.findById(brandId)
                .orElseThrow(() -> new ResourceNotFoundException("Brand", brandId));
        Page<Book> bookPage = bookRepository.findByBrandIdAndActiveTrue(brandId, pageable);
        return PageResponse.from(bookPage, this::mapToBookResponse);
    }

    @Transactional
    public BookResponse create(BookRequest request) {
        Book book = buildBook(request, new Book());
        book = bookRepository.save(book);
        return mapToBookResponse(book);
    }

    @Transactional
    public BookResponse update(Long id, BookRequest request) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Book", id));
        book = buildBook(request, book);
        book = bookRepository.save(book);
        return mapToBookResponse(book);
    }

    @Transactional
    public void delete(Long id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Book", id));
        book.setActive(false);
        bookRepository.save(book);
    }

    // ---- Helpers ----

    private Book buildBook(BookRequest req, Book book) {
        Category category = null;
        if (req.getCategoryId() != null) {
            category = categoryRepository.findById(req.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category", req.getCategoryId()));
        }
        Brand brand = null;
        if (req.getBrandId() != null) {
            brand = brandRepository.findById(req.getBrandId())
                    .orElseThrow(() -> new ResourceNotFoundException("Brand", req.getBrandId()));
        }
        book.setTitle(req.getTitle());
        book.setAuthor(req.getAuthor());
        book.setDescription(req.getDescription());
        book.setPrice(req.getPrice());
        book.setStockQuantity(req.getStockQuantity() != null ? req.getStockQuantity() : 0);
        book.setIsbn(req.getIsbn());
        book.setImageUrl(req.getImageUrl());
        book.setPublicationYear(req.getPublicationYear());
        book.setCategory(category);
        book.setBrand(brand);
        if (book.getActive() == null) book.setActive(true);
        if (book.getSalesCount() == null) book.setSalesCount(0L);
        return book;
    }

    public BookResponse mapToBookResponse(Book book) {
        return BookResponse.builder()
                .id(book.getId())
                .title(book.getTitle())
                .author(book.getAuthor())
                .description(book.getDescription())
                .price(book.getPrice())
                .stockQuantity(book.getStockQuantity())
                .isbn(book.getIsbn())
                .imageUrl(book.getImageUrl())
                .publicationYear(book.getPublicationYear())
                .active(book.getActive())
                .category(book.getCategory() != null ? mapToCategoryResponse(book.getCategory()) : null)
                .brand(book.getBrand() != null ? mapToBrandResponse(book.getBrand()) : null)
                .salesCount(book.getSalesCount())
                .deliveryDate(calculateDeliveryDate())
                .inStock(book.getStockQuantity() != null && book.getStockQuantity() > 0)
                .createdAt(book.getCreatedAt())
                .updatedAt(book.getUpdatedAt())
                .build();
    }

    public CategoryResponse mapToCategoryResponse(Category category) {
        return CategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .description(category.getDescription())
                .imageUrl(category.getImageUrl())
                .createdAt(category.getCreatedAt())
                .build();
    }

    public BrandResponse mapToBrandResponse(Brand brand) {
        return BrandResponse.builder()
                .id(brand.getId())
                .name(brand.getName())
                .description(brand.getDescription())
                .logoUrl(brand.getLogoUrl())
                .createdAt(brand.getCreatedAt())
                .build();
    }

    private LocalDate calculateDeliveryDate() {
        LocalDate date = LocalDate.now();
        int daysAdded = 0;
        int businessDays = appProperties.getDeliveryBusinessDays();
        while (daysAdded < businessDays) {
            date = date.plusDays(1);
            DayOfWeek dow = date.getDayOfWeek();
            if (dow != DayOfWeek.SATURDAY && dow != DayOfWeek.SUNDAY) {
                daysAdded++;
            }
        }
        return date;
    }

    private Sort parseSortParam(String sort) {
        if (sort == null || sort.isBlank()) return Sort.by("createdAt").descending();
        return switch (sort) {
            case "price_asc"    -> Sort.by("price").ascending();
            case "price_desc"   -> Sort.by("price").descending();
            case "title_asc"    -> Sort.by("title").ascending();
            case "title_desc"   -> Sort.by("title").descending();
            case "bestselling"  -> Sort.by("salesCount").descending();
            case "newest"       -> Sort.by("publicationYear").descending();
            default             -> Sort.by("createdAt").descending();
        };
    }

    private Specification<Book> buildSpec(Long categoryId, Long brandId,
                                           BigDecimal minPrice, BigDecimal maxPrice,
                                           String search, Boolean inStock) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(cb.isTrue(root.get("active")));

            if (categoryId != null) {
                predicates.add(cb.equal(root.get("category").get("id"), categoryId));
            }
            if (brandId != null) {
                predicates.add(cb.equal(root.get("brand").get("id"), brandId));
            }
            if (minPrice != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("price"), minPrice));
            }
            if (maxPrice != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("price"), maxPrice));
            }
            if (search != null && !search.isBlank()) {
                String pattern = "%" + search.toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("title")), pattern),
                        cb.like(cb.lower(root.get("author")), pattern),
                        cb.like(cb.lower(root.get("description")), pattern)
                ));
            }
            if (Boolean.TRUE.equals(inStock)) {
                predicates.add(cb.greaterThan(root.get("stockQuantity"), 0));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
