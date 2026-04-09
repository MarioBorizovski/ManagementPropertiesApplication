package org.example.managementproject.service;

import org.example.managementproject.model.Property;
import org.example.managementproject.model.User;
import org.example.managementproject.repository.PropertyRepository;
import org.example.managementproject.repository.ReviewRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ReviewServiceTest {

    @Mock
    private ReviewRepository reviewRepository;

    @Mock
    private UserService userService;

    @Mock
    private PropertyRepository propertyRepository;

    @InjectMocks
    private ReviewService reviewService;

    @Test
    void canUserReview_ShouldReturnTrue_WhenUserHasConfirmedBookingAndNoPreviousReview() {
        Long propertyId = 1L;
        User user = new User();
        user.setId(1L);
        
        Property property = new Property();
        property.setId(propertyId);
        
        when(userService.getAuthenticatedUser()).thenReturn(user);
        when(propertyRepository.findById(propertyId)).thenReturn(Optional.of(property));
        when(reviewRepository.hasConfirmedBooking(user.getId(), propertyId)).thenReturn(true);
        when(reviewRepository.existsByUserAndProperty(user, property)).thenReturn(false);

        assertTrue(reviewService.canUserReview(propertyId));
    }

    @Test
    void canUserReview_ShouldReturnFalse_WhenUserAlreadyReviewed() {
        Long propertyId = 1L;
        User user = new User();
        user.setId(1L);
        
        Property property = new Property();
        property.setId(propertyId);
        
        when(userService.getAuthenticatedUser()).thenReturn(user);
        when(propertyRepository.findById(propertyId)).thenReturn(Optional.of(property));
        when(reviewRepository.hasConfirmedBooking(user.getId(), propertyId)).thenReturn(true);
        when(reviewRepository.existsByUserAndProperty(user, property)).thenReturn(true);

        assertFalse(reviewService.canUserReview(propertyId));
    }
}
