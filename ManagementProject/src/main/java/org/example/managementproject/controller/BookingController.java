package org.example.managementproject.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.managementproject.dto.request.BookingRequest;
import org.example.managementproject.dto.response.BookingResponse;
import org.example.managementproject.service.BookingService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    // ─── USER ─────────────────────────────────────────────────────────────────

    @PostMapping
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<BookingResponse> createBooking(@Valid @RequestBody BookingRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(bookingService.createBooking(request));
    }

    @GetMapping("/my-bookings")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Page<BookingResponse>> getMyBookings(Pageable pageable) {
        return ResponseEntity.ok(bookingService.getBookingsByCurrentUser(pageable));
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<BookingResponse> getBookingById(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.getBookingById(id));
    }

    @PatchMapping("/{id}/cancel")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<BookingResponse> cancelBooking(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.cancelBooking(id));
    }

    // ─── NEW: Get booked date ranges for a property (blocks dates in UI) ──────

    @GetMapping("/property/{propertyId}/booked-dates")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<BookedDateRange>> getBookedDates(@PathVariable Long propertyId) {
        return ResponseEntity.ok(bookingService.getBookedDateRanges(propertyId));
    }

    public record BookedDateRange(LocalDate checkIn, LocalDate checkOut) {}

    // ─── AGENT ────────────────────────────────────────────────────────────────

    @GetMapping("/property/{propertyId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'AGENT')")
    public ResponseEntity<Page<BookingResponse>> getBookingsByProperty(
            @PathVariable Long propertyId, Pageable pageable) {
        return ResponseEntity.ok(bookingService.getBookingsByProperty(propertyId, pageable));
    }

    @PatchMapping("/{id}/confirm")
    @PreAuthorize("hasAnyRole('ADMIN', 'AGENT')")
    public ResponseEntity<BookingResponse> confirmBooking(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.confirmBooking(id));
    }

    @PatchMapping("/{id}/reject")
    @PreAuthorize("hasAnyRole('ADMIN', 'AGENT')")
    public ResponseEntity<BookingResponse> rejectBooking(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.rejectBooking(id));
    }

    // ─── ADMIN ────────────────────────────────────────────────────────────────

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<BookingResponse>> getAllBookings(Pageable pageable) {
        return ResponseEntity.ok(bookingService.getAllBookings(pageable));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteBooking(@PathVariable Long id) {
        bookingService.deleteBooking(id);
        return ResponseEntity.noContent().build();
    }
}