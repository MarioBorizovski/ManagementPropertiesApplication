package org.example.managementproject.service;

import org.example.managementproject.dto.request.BookingRequest;
import org.example.managementproject.model.Property;
import org.example.managementproject.model.User;
import org.example.managementproject.model.exception.BadRequestException;
import org.example.managementproject.repository.BookingRepository;
import org.example.managementproject.repository.PropertyRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class BookingServiceTest {

    @Mock
    private PropertyRepository propertyRepository;

    @Mock
    private UserService userService;

    @InjectMocks
    private BookingService bookingService;

    @Test
    void createBooking_ShouldThrowBadRequest_WhenPropertyNotAvailable() {
        BookingRequest request = new BookingRequest();
        request.setPropertyId(1L);
        request.setCheckInDate(LocalDate.now().plusDays(1));
        request.setCheckOutDate(LocalDate.now().plusDays(5));
        
        User user = new User();
        when(userService.getAuthenticatedUser()).thenReturn(user);
        
        Property property = new Property();
        property.setId(1L);
        property.setAvailable(false); // Property is not available
        
        when(propertyRepository.findById(1L)).thenReturn(Optional.of(property));

        assertThrows(BadRequestException.class, () -> bookingService.createBooking(request));
    }
}
