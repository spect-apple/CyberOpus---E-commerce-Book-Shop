package com.cyberopus.controller;

import com.cyberopus.dto.request.BrandRequest;
import com.cyberopus.dto.response.BookResponse;
import com.cyberopus.dto.response.BrandResponse;
import com.cyberopus.dto.response.PageResponse;
import com.cyberopus.entity.Brand;
import com.cyberopus.exception.ConflictException;
import com.cyberopus.exception.ResourceNotFoundException;
import com.cyberopus.repository.BrandRepository;
import com.cyberopus.service.BookService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/brands")
@RequiredArgsConstructor
@Tag(name = "Brands", description = "Browse and manage publishers/brands")
public class BrandController {

    private final BrandRepository brandRepository;
    private final BookService bookService;

    @GetMapping
    @Operation(summary = "Get all brands")
    public ResponseEntity<List<BrandResponse>> getAllBrands() {
        List<BrandResponse> brands = brandRepository.findAll()
                .stream().map(bookService::mapToBrandResponse).collect(Collectors.toList());
        return ResponseEntity.ok(brands);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a single brand by ID")
    public ResponseEntity<BrandResponse> getBrandById(@PathVariable Long id) {
        Brand brand = brandRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Brand", id));
        return ResponseEntity.ok(bookService.mapToBrandResponse(brand));
    }

    @GetMapping("/{id}/books")
    @Operation(summary = "Get all books for a brand")
    public ResponseEntity<PageResponse<BookResponse>> getBooksByBrand(
            @PathVariable Long id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        return ResponseEntity.ok(bookService.findByBrandId(id, PageRequest.of(page, size)));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create a new brand (Admin only)")
    public ResponseEntity<BrandResponse> createBrand(@Valid @RequestBody BrandRequest request) {
        if (brandRepository.existsByName(request.getName())) {
            throw new ConflictException("Brand already exists: " + request.getName());
        }
        Brand brand = Brand.builder()
                .name(request.getName())
                .description(request.getDescription())
                .logoUrl(request.getLogoUrl())
                .build();
        brand = brandRepository.save(brand);
        return ResponseEntity.status(HttpStatus.CREATED).body(bookService.mapToBrandResponse(brand));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update a brand (Admin only)")
    public ResponseEntity<BrandResponse> updateBrand(@PathVariable Long id,
                                                      @Valid @RequestBody BrandRequest request) {
        Brand brand = brandRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Brand", id));
        brand.setName(request.getName());
        brand.setDescription(request.getDescription());
        brand.setLogoUrl(request.getLogoUrl());
        brand = brandRepository.save(brand);
        return ResponseEntity.ok(bookService.mapToBrandResponse(brand));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete a brand (Admin only)")
    public ResponseEntity<Void> deleteBrand(@PathVariable Long id) {
        Brand brand = brandRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Brand", id));
        brandRepository.delete(brand);
        return ResponseEntity.noContent().build();
    }
}
