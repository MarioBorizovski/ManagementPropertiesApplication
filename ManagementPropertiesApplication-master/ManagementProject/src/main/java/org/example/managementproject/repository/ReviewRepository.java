package org.example.managementproject.repository;

import org.example.managementproject.model.Property;
import org.example.managementproject.model.Review;
import org.example.managementproject.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    @EntityGraph(attributePaths = {"user", "property"})
    Page<Review> findByPropertyId(Long propertyId, Pageable pageable);

    boolean existsByUserAndProperty(User user, Property property);

    Optional<Review> findByUserAndProperty(User user, Property property);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.property.id = :propertyId")
    Double findAverageRatingByPropertyId(@Param("propertyId") Long propertyId);

    @Query("SELECT COUNT(r) FROM Review r WHERE r.property.id = :propertyId")
    long countByPropertyId(@Param("propertyId") Long propertyId);

    @Query("""
        SELECT COUNT(b) > 0 FROM Booking b
        WHERE b.user.id = :userId
        AND b.property.id = :propertyId
        AND b.status = 'CONFIRMED'
        """)
    boolean hasConfirmedBooking(@Param("userId") Long userId, @Param("propertyId") Long propertyId);
}