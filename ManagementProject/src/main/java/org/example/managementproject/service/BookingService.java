package org.example.managementproject.service;

import lombok.RequiredArgsConstructor;
import org.example.managementproject.controller.BookingController.BookedDateRange;
import org.example.managementproject.dto.request.BookingRequest;
import org.example.managementproject.dto.response.BookingResponse;
import org.example.managementproject.model.exception.AccessDeniedException;
import org.example.managementproject.model.exception.BadRequestException;
import org.example.managementproject.model.exception.ResourceNotFoundException;
import org.example.managementproject.model.Booking;
import org.example.managementproject.model.BookingStatus;
import org.example.managementproject.model.Property;
import org.example.managementproject.model.User;
import org.example.managementproject.repository.BookingRepository;
import org.example.managementproject.repository.PropertyRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final PropertyRepository propertyRepository;
    private final UserService userService;

    @Transactional
    public BookingResponse createBooking(BookingRequest request) {
        User user = userService.getAuthenticatedUser();
        Property property = propertyRepository.findById(request.getPropertyId())
                .orElseThrow(() -> new ResourceNotFoundException("Property not found"));

        if (!property.isAvailable())
            throw new BadRequestException("Property is not available for booking");
        if (!request.getCheckOutDate().isAfter(request.getCheckInDate()))
            throw new BadRequestException("Check-out date must be after check-in date");
        if (request.getGuests() > property.getMaxGuests())
            throw new BadRequestException("Guest count exceeds property maximum of " + property.getMaxGuests());

        boolean hasConflict = bookingRepository.existsConflictingBooking(
                property.getId(), request.getCheckInDate(), request.getCheckOutDate());
        if (hasConflict)
            throw new BadRequestException("Property is already booked for the selected dates");

        long nights = ChronoUnit.DAYS.between(request.getCheckInDate(), request.getCheckOutDate());
        double totalPrice = nights * property.getPricePerNight();

        Booking booking = Booking.builder()
                .property(property)
                .user(user)
                .checkInDate(request.getCheckInDate())
                .checkOutDate(request.getCheckOutDate())
                .guests(request.getGuests())
                .totalPrice(totalPrice)
                .specialRequests(request.getSpecialRequests())
                .status(BookingStatus.PENDING)
                .build();

        return toResponse(bookingRepository.save(booking));
    }

    // ✅ NEW — returns booked date ranges for a property to block on the frontend
    public List<BookedDateRange> getBookedDateRanges(Long propertyId) {
        return bookingRepository
                .findActiveBookingsByPropertyId(propertyId)
                .stream()
                .map(b -> new BookedDateRange(b.getCheckInDate(), b.getCheckOutDate()))
                .toList();
    }

    public Page<BookingResponse> getBookingsByCurrentUser(Pageable pageable) {
        User user = userService.getAuthenticatedUser();
        return bookingRepository.findByUser(user, pageable).map(this::toResponse);
    }

    public BookingResponse getBookingById(Long id) {
        Booking booking = findBookingById(id);
        checkAccessToBooking(booking);
        return toResponse(booking);
    }

    @Transactional
    public BookingResponse cancelBooking(Long id) {
        Booking booking = findBookingById(id);
        checkAccessToBooking(booking);
        if (booking.getStatus() == BookingStatus.CANCELLED)
            throw new BadRequestException("Booking is already cancelled");
        if (booking.getStatus() == BookingStatus.CONFIRMED)
            throw new BadRequestException("Cannot cancel a confirmed booking. Contact support.");
        booking.setStatus(BookingStatus.CANCELLED);
        return toResponse(bookingRepository.save(booking));
    }

    @Transactional
    public BookingResponse confirmBooking(Long id) {
        Booking booking = findBookingById(id);
        checkAgentOrAdminAccess(booking);
        booking.setStatus(BookingStatus.CONFIRMED);
        return toResponse(bookingRepository.save(booking));
    }

    @Transactional
    public BookingResponse rejectBooking(Long id) {
        Booking booking = findBookingById(id);
        checkAgentOrAdminAccess(booking);
        booking.setStatus(BookingStatus.REJECTED);
        return toResponse(bookingRepository.save(booking));
    }

    public Page<BookingResponse> getBookingsByProperty(Long propertyId, Pageable pageable) {
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new ResourceNotFoundException("Property not found"));
        return bookingRepository.findByProperty(property, pageable).map(this::toResponse);
    }

    public Page<BookingResponse> getAllBookings(Pageable pageable) {
        return bookingRepository.findAll(pageable).map(this::toResponse);
    }

    @Transactional
    public void deleteBooking(Long id) {
        bookingRepository.delete(findBookingById(id));
    }

    // ─── Helpers ──────────────────────────────────────────────────────────────

    private Booking findBookingById(Long id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));
    }

    private void checkAccessToBooking(Booking booking) {
        User currentUser = userService.getAuthenticatedUser();
        boolean isAdmin       = currentUser.getRole().getName().equals("ROLE_ADMIN");
        boolean isOwner       = booking.getUser().getId().equals(currentUser.getId());
        boolean isPropertyAgent = booking.getProperty().getAgent().getId().equals(currentUser.getId());
        if (!isAdmin && !isOwner && !isPropertyAgent)
            throw new AccessDeniedException("Access denied to this booking");
    }

    private void checkAgentOrAdminAccess(Booking booking) {
        User currentUser = userService.getAuthenticatedUser();
        boolean isAdmin       = currentUser.getRole().getName().equals("ROLE_ADMIN");
        boolean isPropertyAgent = booking.getProperty().getAgent().getId().equals(currentUser.getId());
        if (!isAdmin && !isPropertyAgent)
            throw new AccessDeniedException("Only the property agent or admin can perform this action");
    }

    public BookingResponse toResponse(Booking booking) {
        return BookingResponse.builder()
                .id(booking.getId())
                .propertyId(booking.getProperty().getId())
                .propertyTitle(booking.getProperty().getTitle())
                .propertyCity(booking.getProperty().getCity())
                .userId(booking.getUser().getId())
                .userName(booking.getUser().getFirstName() + " " + booking.getUser().getLastName())
                .checkInDate(booking.getCheckInDate())
                .checkOutDate(booking.getCheckOutDate())
                .guests(booking.getGuests())
                .totalPrice(booking.getTotalPrice())
                .status(booking.getStatus().name())
                .specialRequests(booking.getSpecialRequests())
                .createdAt(booking.getCreatedAt())
                .build();
    }
}