package com.cyberopus.repository;

import com.cyberopus.entity.Book;
import jakarta.persistence.LockModeType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookRepository extends JpaRepository<Book, Long>, JpaSpecificationExecutor<Book> {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT b FROM Book b WHERE b.id = :id")
    Optional<Book> findByIdWithLock(@Param("id") Long id);

    Page<Book> findByCategoryIdAndActiveTrue(Long categoryId, Pageable pageable);

    Page<Book> findByBrandIdAndActiveTrue(Long brandId, Pageable pageable);

    List<Book> findByCategoryIdAndIdNotAndActiveTrueOrderBySalesCountDesc(
            Long categoryId, Long excludeId, Pageable pageable);

    List<Book> findTop10ByActiveTrueOrderBySalesCountDesc();

    List<Book> findByCategoryIdInAndIdNotInAndActiveTrueAndStockQuantityGreaterThan(
            List<Long> categoryIds, List<Long> excludeIds, int minStock, Pageable pageable);

    List<Book> findByBrandIdInAndIdNotInAndActiveTrueAndStockQuantityGreaterThan(
            List<Long> brandIds, List<Long> excludeIds, int minStock, Pageable pageable);

    List<Book> findTop20ByActiveTrueAndStockQuantityGreaterThanOrderBySalesCountDesc(int minStock);
}
