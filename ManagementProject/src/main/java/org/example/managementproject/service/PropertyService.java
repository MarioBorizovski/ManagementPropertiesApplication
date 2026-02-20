package org.example.managementproject.service;

import lombok.RequiredArgsConstructor;
import org.example.managementproject.dto.request.PropertyRequest;
import org.example.managementproject.dto.response.PropertyResponse;
import org.example.managementproject.model.exception.AccessDeniedException;
import org.example.managementproject.model.exception.ResourceNotFoundException;
import org.example.managementproject.model.Property;
import org.example.managementproject.model.PropertyImage;
import org.example.managementproject.model.User;
import org.example.managementproject.repository.PropertyImageRepository;
import org.example.managementproject.repository.PropertyRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PropertyService {

    private final PropertyRepository propertyRepository;
    private final PropertyImageRepository propertyImageRepository;
    private final UserService userService;
    private final FileStorageService fileStorageService;

    public Page<PropertyResponse> searchProperties(
            String city, String type,
            Double minPrice, Double maxPrice,
            Integer minBedrooms, Pageable pageable) {
        return propertyRepository
                .findByFilters(city, type, minPrice, maxPrice, minBedrooms, pageable)
                .map(this::toResponse);
    }

    public PropertyResponse getPropertyById(Long id) {
        return toResponse(findPropertyById(id));
    }

    @Transactional
    public PropertyResponse createProperty(PropertyRequest request) {
        User agent = userService.getAuthenticatedUser();

        Property property = Property.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .address(request.getAddress())
                .city(request.getCity())
                .country(request.getCountry())
                .type(request.getType())
                .pricePerNight(request.getPricePerNight())
                .bedrooms(request.getBedrooms())
                .bathrooms(request.getBathrooms())
                .maxGuests(request.getMaxGuests())
                .available(request.isAvailable())
                .agent(agent)
                .build();

        return toResponse(propertyRepository.save(property));
    }

    @Transactional
    public PropertyResponse updateProperty(Long id, PropertyRequest request) {
        Property property = findPropertyById(id);
        checkOwnershipOrAdmin(property);

        property.setTitle(request.getTitle());
        property.setDescription(request.getDescription());
        property.setAddress(request.getAddress());
        property.setCity(request.getCity());
        property.setCountry(request.getCountry());
        property.setType(request.getType());
        property.setPricePerNight(request.getPricePerNight());
        property.setBedrooms(request.getBedrooms());
        property.setBathrooms(request.getBathrooms());
        property.setMaxGuests(request.getMaxGuests());
        property.setAvailable(request.isAvailable());

        return toResponse(propertyRepository.save(property));
    }

    @Transactional
    public List<String> uploadImages(Long propertyId, List<MultipartFile> files) {
        Property property = findPropertyById(propertyId);
        checkOwnershipOrAdmin(property);

        boolean hasMain = propertyImageRepository
                .findByPropertyAndIsMainTrue(property).isPresent();

        List<String> urls = new java.util.ArrayList<>();

        for (int i = 0; i < files.size(); i++) {
            String url = fileStorageService.storeFile(files.get(i));
            PropertyImage image = PropertyImage.builder()
                    .property(property)
                    .imageUrl(url)
                    .isMain(!hasMain && i == 0)
                    .build();
            propertyImageRepository.save(image);
            urls.add(url);
        }

        return urls;
    }

    @Transactional
    public void setMainImage(Long propertyId, Long imageId) {
        Property property = findPropertyById(propertyId);
        checkOwnershipOrAdmin(property);

        // Clear existing main
        propertyImageRepository.findByPropertyAndIsMainTrue(property)
                .ifPresent(img -> {
                    img.setMain(false);
                    propertyImageRepository.save(img);
                });

        // Set new main
        PropertyImage image = propertyImageRepository.findById(imageId)
                .orElseThrow(() -> new ResourceNotFoundException("Image not found"));
        image.setMain(true);
        propertyImageRepository.save(image);
    }

    @Transactional
    public void deleteImage(Long propertyId, Long imageId) {
        Property property = findPropertyById(propertyId);
        checkOwnershipOrAdmin(property);

        PropertyImage image = propertyImageRepository.findById(imageId)
                .orElseThrow(() -> new ResourceNotFoundException("Image not found"));

        fileStorageService.deleteFile(image.getImageUrl());
        propertyImageRepository.delete(image);

        // If deleted image was main, set first remaining as main
        if (image.isMain()) {
            propertyImageRepository.findByProperty(property)
                    .stream().findFirst()
                    .ifPresent(first -> {
                        first.setMain(true);
                        propertyImageRepository.save(first);
                    });
        }
    }

    @Transactional
    public void deleteProperty(Long id) {
        Property property = findPropertyById(id);
        checkOwnershipOrAdmin(property);

        // Delete all images from disk
        propertyImageRepository.findByProperty(property)
                .forEach(img -> fileStorageService.deleteFile(img.getImageUrl()));

        propertyRepository.delete(property);
    }

    @Transactional
    public PropertyResponse toggleAvailability(Long id) {
        Property property = findPropertyById(id);
        checkOwnershipOrAdmin(property);
        property.setAvailable(!property.isAvailable());
        return toResponse(propertyRepository.save(property));
    }

    public Page<PropertyResponse> getPropertiesByCurrentAgent(Pageable pageable) {
        User agent = userService.getAuthenticatedUser();
        return propertyRepository.findByAgent(agent, pageable).map(this::toResponse);
    }

    // ─── Helpers ──────────────────────────────────────────────────────────────

    private Property findPropertyById(Long id) {
        return propertyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Property not found with id: " + id));
    }

    private void checkOwnershipOrAdmin(Property property) {
        User currentUser = userService.getAuthenticatedUser();
        boolean isAdmin  = currentUser.getRole().getName().equals("ROLE_ADMIN");
        boolean isOwner  = property.getAgent().getId().equals(currentUser.getId());
        if (!isAdmin && !isOwner) {
            throw new AccessDeniedException("You do not have permission to modify this property");
        }
    }

    public PropertyResponse toResponse(Property property) {
        List<PropertyImage> images = propertyImageRepository.findByProperty(property);

        String mainImageUrl = images.stream()
                .filter(PropertyImage::isMain)
                .findFirst()
                .map(img -> "http://localhost:8080" + img.getImageUrl())
                .orElse(images.isEmpty() ? null
                        : "http://localhost:8080" + images.get(0).getImageUrl());

        List<String> imageUrls = images.stream()
                .map(img -> "http://localhost:8080" + img.getImageUrl())
                .collect(Collectors.toList());

        return PropertyResponse.builder()
                .id(property.getId())
                .title(property.getTitle())
                .description(property.getDescription())
                .address(property.getAddress())
                .city(property.getCity())
                .country(property.getCountry())
                .type(property.getType())
                .pricePerNight(property.getPricePerNight())
                .bedrooms(property.getBedrooms())
                .bathrooms(property.getBathrooms())
                .maxGuests(property.getMaxGuests())
                .available(property.isAvailable())
                .mainImageUrl(mainImageUrl)
                .imageUrls(imageUrls)
                .agentId(property.getAgent().getId())
                .agentName(property.getAgent().getFirstName() + " " + property.getAgent().getLastName())
                .createdAt(property.getCreatedAt())
                .build();
    }
}