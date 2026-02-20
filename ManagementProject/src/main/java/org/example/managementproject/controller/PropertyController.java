package org.example.managementproject.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.managementproject.dto.request.PropertyRequest;
import org.example.managementproject.dto.response.PropertyResponse;
import org.example.managementproject.service.FileStorageService;
import org.example.managementproject.service.PropertyService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/properties")
@RequiredArgsConstructor
public class PropertyController {

    private final PropertyService propertyService;
    private final FileStorageService fileStorageService;

    // ─── PUBLIC ───────────────────────────────────────────────────────────────

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Page<PropertyResponse>> getAllProperties(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) Integer minBedrooms,
            Pageable pageable) {
        return ResponseEntity.ok(
                propertyService.searchProperties(city, type, minPrice, maxPrice, minBedrooms, pageable));
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<PropertyResponse> getPropertyById(@PathVariable Long id) {
        return ResponseEntity.ok(propertyService.getPropertyById(id));
    }

    // ─── AGENT + ADMIN ────────────────────────────────────────────────────────

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'AGENT')")
    public ResponseEntity<PropertyResponse> createProperty(
            @Valid @RequestBody PropertyRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(propertyService.createProperty(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'AGENT')")
    public ResponseEntity<PropertyResponse> updateProperty(
            @PathVariable Long id,
            @Valid @RequestBody PropertyRequest request) {
        return ResponseEntity.ok(propertyService.updateProperty(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'AGENT')")
    public ResponseEntity<Void> deleteProperty(@PathVariable Long id) {
        propertyService.deleteProperty(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/availability")
    @PreAuthorize("hasAnyRole('ADMIN', 'AGENT')")
    public ResponseEntity<PropertyResponse> toggleAvailability(@PathVariable Long id) {
        return ResponseEntity.ok(propertyService.toggleAvailability(id));
    }

    // ─── IMAGE UPLOAD ─────────────────────────────────────────────────────────

    @PostMapping("/{id}/images")
    @PreAuthorize("hasAnyRole('ADMIN', 'AGENT')")
    public ResponseEntity<List<String>> uploadImages(
            @PathVariable Long id,
            @RequestParam("files") List<MultipartFile> files) {
        return ResponseEntity.ok(propertyService.uploadImages(id, files));
    }

    @PatchMapping("/{id}/images/{imageId}/main")
    @PreAuthorize("hasAnyRole('ADMIN', 'AGENT')")
    public ResponseEntity<Void> setMainImage(@PathVariable Long id, @PathVariable Long imageId) {
        propertyService.setMainImage(id, imageId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/my-listings")
    @PreAuthorize("hasAnyRole('ADMIN', 'AGENT')")
    public ResponseEntity<Page<PropertyResponse>> getMyListings(Pageable pageable) {
        return ResponseEntity.ok(propertyService.getPropertiesByCurrentAgent(pageable));
    }
}