package com.cyberopus.repository;

import com.cyberopus.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    List<OrderItem> findByOrderId(Long orderId);

    @Query("SELECT DISTINCT oi.book.category.id FROM OrderItem oi " +
           "JOIN oi.order o WHERE o.user.id = :userId AND o.status = 'CONFIRMED' " +
           "AND oi.book IS NOT NULL AND oi.book.category IS NOT NULL")
    List<Long> findPurchasedCategoryIdsByUserId(@Param("userId") Long userId);

    @Query("SELECT DISTINCT oi.book.brand.id FROM OrderItem oi " +
           "JOIN oi.order o WHERE o.user.id = :userId AND o.status = 'CONFIRMED' " +
           "AND oi.book IS NOT NULL AND oi.book.brand IS NOT NULL")
    List<Long> findPurchasedBrandIdsByUserId(@Param("userId") Long userId);

    @Query("SELECT DISTINCT oi.book.id FROM OrderItem oi " +
           "JOIN oi.order o WHERE o.user.id = :userId AND oi.book IS NOT NULL")
    List<Long> findPurchasedBookIdsByUserId(@Param("userId") Long userId);
}
