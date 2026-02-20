package org.example.managementproject.repository;

import org.example.managementproject.model.Property;
import org.example.managementproject.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PropertyRepository extends JpaRepository<Property, Long> {

    Page<Property> findByAgent(User agent, Pageable pageable);

    @Query("SELECT p FROM Property p")
    Page<Property> findAllProperties(Pageable pageable);

    @Query("""
        SELECT p FROM Property p
        WHERE (:city      IS NULL OR LOWER(p.city)  LIKE LOWER(CONCAT('%', CAST(:city AS string), '%')))
          AND (:type      IS NULL OR p.type          = CAST(:type AS string))
          AND (:minPrice  IS NULL OR p.pricePerNight >= :minPrice)
          AND (:maxPrice  IS NULL OR p.pricePerNight <= :maxPrice)
          AND (:minBeds   IS NULL OR p.bedrooms      >= :minBeds)
          AND p.available = true
        """)
    Page<Property> findByFilters(
            @Param("city")     String city,
            @Param("type")     String type,
            @Param("minPrice") Double minPrice,
            @Param("maxPrice") Double maxPrice,
            @Param("minBeds")  Integer minBedrooms,
            Pageable pageable);
}