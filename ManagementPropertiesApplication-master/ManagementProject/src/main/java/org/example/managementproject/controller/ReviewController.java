package org.example.managementproject.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.managementproject.dto.request.ReviewRequest;
import org.example.managementproject.dto.response.ReviewResponse;
import org.example.managementproject.service.ReviewService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ReviewResponse> createReview(@Valid @RequestBody ReviewRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(reviewService.createReview(request));
    }

    @GetMapping("/property/{propertyId}")
    public ResponseEntity<Page<ReviewResponse>> getReviewsByProperty(
            @PathVariable Long propertyId, Pageable pageable) {
        return ResponseEntity.ok(reviewService.getReviewsByProperty(propertyId, pageable));
    }

    @GetMapping("/property/{propertyId}/can-review")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> canReview(@PathVariable Long propertyId) {
        return ResponseEntity.ok(reviewService.canUserReview(propertyId));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> deleteReview(@PathVariable Long id) {
        reviewService.deleteReview(id);
        return ResponseEntity.noContent().build();
    }
}