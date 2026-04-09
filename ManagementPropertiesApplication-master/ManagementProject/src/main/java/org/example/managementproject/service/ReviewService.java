package org.example.managementproject.service;

import lombok.RequiredArgsConstructor;
import org.example.managementproject.dto.request.ReviewRequest;
import org.example.managementproject.dto.response.ReviewResponse;
import org.example.managementproject.model.exception.AccessDeniedException;
import org.example.managementproject.model.exception.BadRequestException;
import org.example.managementproject.model.exception.ResourceNotFoundException;
import org.example.managementproject.model.Property;
import org.example.managementproject.model.Review;
import org.example.managementproject.model.User;
import org.example.managementproject.repository.PropertyRepository;
import org.example.managementproject.repository.ReviewRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final PropertyRepository propertyRepository;
    private final UserService userService;

    @Transactional
    public ReviewResponse createReview(ReviewRequest request) {
        User user = userService.getAuthenticatedUser();
        Property property = propertyRepository.findById(request.getPropertyId())
                .orElseThrow(() -> new ResourceNotFoundException("Property not found"));

        if (!reviewRepository.hasConfirmedBooking(user.getId(), property.getId()))
            throw new BadRequestException("You can only review properties you have a confirmed booking for");

        if (reviewRepository.existsByUserAndProperty(user, property))
            throw new BadRequestException("You have already reviewed this property");

        Review review = Review.builder()
                .user(user)
                .property(property)
                .rating(request.getRating())
                .comment(request.getComment())
                .build();

        return toResponse(reviewRepository.save(review));
    }

    @Transactional(readOnly = true)
    public Page<ReviewResponse> getReviewsByProperty(Long propertyId, Pageable pageable) {
        return reviewRepository.findByPropertyId(propertyId, pageable).map(this::toResponse);
    }

    public boolean hasUserReviewed(Long propertyId) {
        User user = userService.getAuthenticatedUser();
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new ResourceNotFoundException("Property not found"));
        return reviewRepository.existsByUserAndProperty(user, property);
    }

    public java.util.Map<String, Object> canUserReview(Long propertyId) {
        User user = userService.getAuthenticatedUser();
        // Check if user has a confirmed booking for this property
        if (!reviewRepository.hasConfirmedBooking(user.getId(), propertyId)) {
            return java.util.Map.of("canReview", false, "reason", "NO_BOOKING");
        }
        // Check if user already reviewed this property
        boolean alreadyReviewed = reviewRepository.existsByUserAndProperty(user,
                propertyRepository.getReferenceById(propertyId));
        if (alreadyReviewed) {
            return java.util.Map.of("canReview", false, "reason", "ALREADY_REVIEWED");
        }
        return java.util.Map.of("canReview", true, "reason", "OK");
    }

    @Transactional
    public void deleteReview(Long id) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found"));
        User currentUser = userService.getAuthenticatedUser();
        boolean isAdmin = currentUser.getRole().getName().equals("ROLE_ADMIN");
        boolean isOwner = review.getUser().getId().equals(currentUser.getId());
        if (!isAdmin && !isOwner)
            throw new AccessDeniedException("You do not have permission to delete this review");
        reviewRepository.delete(review);
    }

    private ReviewResponse toResponse(Review review) {
        String userName = "Anonymous";
        if (review.getUser() != null) {
            userName = (review.getUser().getFirstName() != null ? review.getUser().getFirstName() : "")
                    + " " + (review.getUser().getLastName() != null ? review.getUser().getLastName() : "");
            userName = userName.trim().isEmpty() ? "Anonymous" : userName.trim();
        }

        return ReviewResponse.builder()
                .id(review.getId())
                .propertyId(review.getProperty().getId())
                .userId(review.getUser() != null ? review.getUser().getId() : null)
                .userName(userName)
                .rating(review.getRating())
                .comment(review.getComment())
                .createdAt(review.getCreatedAt())
                .build();
    }
}