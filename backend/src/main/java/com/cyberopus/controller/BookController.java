package com.cyberopus.controller;

import com.cyberopus.dto.request.BookRequest;
import com.cyberopus.dto.response.BookResponse;
import com.cyberopus.dto.response.PageResponse;
import com.cyberopus.service.BookService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/books")
@RequiredArgsConstructor
@Tag(name = "Books", description = "Browse, search, and manage books")
public class BookController {

    private final BookService bookService;

    @GetMapping
    @Operation(summary = "Get all books with optional filtering and pagination")
    public ResponseEntity<PageResponse<BookResponse>> getAllBooks(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(required = false) String sort,
            @RequestParam(required = false) Long category,
            @RequestParam(required = false) Long brand,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Boolean inStock) {
        return ResponseEntity.ok(bookService.findAll(page, size, sort, category, brand,
                minPrice, maxPrice, search, inStock));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a single book by ID")
    public ResponseEntity<BookResponse> getBookById(@PathVariable Long id) {
        return ResponseEntity.ok(bookService.findById(id));
    }

    @GetMapping("/search")
    @Operation(summary = "Search books by query string")
    public ResponseEntity<PageResponse<BookResponse>> searchBooks(
            @RequestParam String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        return ResponseEntity.ok(bookService.search(q, page, size));
    }

    @GetMapping("/{id}/related")
    @Operation(summary = "Get related books (same category)")
    public ResponseEntity<List<BookResponse>> getRelatedBooks(@PathVariable Long id) {
        return ResponseEntity.ok(bookService.findRelated(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create a new book (Admin only)")
    public ResponseEntity<BookResponse> createBook(@Valid @RequestBody BookRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(bookService.create(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update a book (Admin only)")
    public ResponseEntity<BookResponse> updateBook(@PathVariable Long id,
                                                    @Valid @RequestBody BookRequest request) {
        return ResponseEntity.ok(bookService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Soft-delete a book (Admin only)")
    public ResponseEntity<Void> deleteBook(@PathVariable Long id) {
        bookService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
