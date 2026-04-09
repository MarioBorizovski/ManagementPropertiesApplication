package org.example.managementproject.repository;

import org.example.managementproject.model.Booking;
import org.example.managementproject.model.Property;
import org.example.managementproject.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    @EntityGraph(attributePaths = {"property.agent", "property.images", "user"})
    Page<Booking> findByUser(User user, Pageable pageable);

    @EntityGraph(attributePaths = {"property.agent", "property.images", "user"})
    Page<Booking> findByProperty(Property property, Pageable pageable);

    @Query("""
            SELECT CASE WHEN COUNT(b) > 0 THEN true ELSE false END
            FROM Booking b
            WHERE b.property.id = :propertyId
              AND b.status NOT IN ('CANCELLED', 'REJECTED')
              AND b.checkInDate  < :checkOut
              AND b.checkOutDate > :checkIn
            """)
    boolean existsConflictingBooking(
            @Param("propertyId") Long propertyId,
            @Param("checkIn")    LocalDate checkIn,
            @Param("checkOut")   LocalDate checkOut);

    @Query("""
            SELECT b FROM Booking b
            WHERE b.property.id = :propertyId
              AND b.status NOT IN ('CANCELLED', 'REJECTED')
              AND b.checkOutDate >= :today
            """)
    List<Booking> findActiveBookingsByPropertyId(
            @Param("propertyId") Long propertyId,
            @Param("today")      LocalDate today);

    @EntityGraph(attributePaths = {"property.agent", "property.images", "user"})
    @Query("SELECT b FROM Booking b WHERE b.property.agent.id = :agentId")
    Page<Booking> findByAgentId(@Param("agentId") Long agentId, Pageable pageable);

    @Query("SELECT b FROM Booking b JOIN FETCH b.property p JOIN FETCH p.agent JOIN FETCH b.user WHERE b.id = :id")
    Optional<Booking> findWithDetailById(@Param("id") Long id);

    default List<Booking> findActiveBookingsByPropertyId(Long propertyId) {
        return findActiveBookingsByPropertyId(propertyId, LocalDate.now());
    }
}