package com.cyberopus.repository;

import com.cyberopus.entity.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public interface WishlistRepository extends JpaRepository<Wishlist, Long> {

    @Query("SELECT w FROM Wishlist w JOIN FETCH w.book b LEFT JOIN FETCH b.category LEFT JOIN FETCH b.brand WHERE w.user.id = :userId ORDER BY w.addedAt DESC")
    List<Wishlist> findByUserIdWithBook(@Param("userId") Long userId);

    Optional<Wishlist> findByUserIdAndBookId(Long userId, Long bookId);

    boolean existsByUserIdAndBookId(Long userId, Long bookId);

    @Modifying
    @Transactional
    @Query("DELETE FROM Wishlist w WHERE w.user.id = :userId AND w.book.id = :bookId")
    void deleteByUserIdAndBookId(@Param("userId") Long userId, @Param("bookId") Long bookId);
}
