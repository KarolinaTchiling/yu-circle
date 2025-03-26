package com.yucircle.marketplaceapp.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.yucircle.marketplaceapp.model.Rating;

@Repository
public interface RatingRepository extends JpaRepository<Rating, Long> {
    List<Rating> findByProductId(Long productId);

    @Query("SELECT AVG(r.rating) FROM Rating r WHERE r.productId = :productId")
    Double findAverageRating(@Param("productId") Long productId);
    
    Optional<Rating> findByUsernameAndProductId(String username, Long productId);
    
    List<Rating> findByUsername(String username);
}