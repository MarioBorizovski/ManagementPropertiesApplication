package org.example.managementproject.service;

import lombok.RequiredArgsConstructor;
import org.example.managementproject.dto.request.PropertyRequest;
import org.example.managementproject.dto.response.PropertyResponse;
import org.example.managementproject.model.PropertyStatus;
import org.example.managementproject.model.exception.AccessDeniedException;
import org.example.managementproject.model.exception.ResourceNotFoundException;
import org.example.managementproject.model.Property;
import org.example.managementproject.model.PropertyImage;
import org.example.managementproject.model.User;
import org.example.managementproject.repository.PropertyImageRepository;
import org.example.managementproject.repository.PropertyRepository;
import org.example.managementproject.repository.ReviewRepository;
import org.example.managementproject.repository.specifications.PropertySpecification;
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
    private final ReviewRepository reviewRepository;
    private final EmailService emailService;
    private final GeocodingService geocodingService;


    @Transactional(readOnly = true)
    public Page<PropertyResponse> searchProperties(
            String city, String type,
            Double minPrice, Double maxPrice,
            Integer minBedrooms, Long agentId, Pageable pageable) {
        return propertyRepository
                .findAll(PropertySpecification.withFilters(city, type, minPrice, maxPrice, minBedrooms, agentId), pageable)
                .map(this::toResponse);
    }
    @Transactional(readOnly = true)
    public PropertyResponse getPropertyById(Long id) {
        return toResponse(findPropertyById(id));
    }

    @Transactional
    public PropertyResponse createProperty(PropertyRequest request) {
        User agent = userService.getAuthenticatedUser();
        boolean isAdmin = agent.getRole() != null && agent.getRole().getName().equals("ROLE_ADMIN");

        // Auto-geocode if coordinates not provided
        Double lat = request.getLatitude();
        Double lng = request.getLongitude();
        if (lat == null || lng == null) {
            String fullAddress = request.getAddress() + ", " + request.getCity() + ", " + request.getCountry();
            double[] coords = geocodingService.geocode(fullAddress);
            if (coords != null) { lat = coords[0]; lng = coords[1]; }
        }

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
                .latitude(lat)
                .longitude(lng)
                .agent(agent)
                .status(isAdmin ? PropertyStatus.APPROVED : PropertyStatus.PENDING)
                .build();

        Property saved = propertyRepository.save(property);
        emailService.sendPropertyPendingNotification(saved);
        return toResponse(saved);
    }

    @Transactional
    public PropertyResponse updateProperty(Long id, PropertyRequest request) {
        Property property = findPropertyById(id);
        checkOwnershipOrAdmin(property);

        User currentUser = userService.getAuthenticatedUser();
        boolean isAdmin = currentUser.getRole().getName().equals("ROLE_ADMIN");
        boolean isAgent = currentUser.getRole().getName().equals("ROLE_AGENT");

        // Check if sensitive fields changed
        boolean sensitiveFieldsChanged = 
            !java.util.Objects.equals(property.getTitle(), request.getTitle()) ||
            !java.util.Objects.equals(property.getAddress(), request.getAddress()) ||
            !java.util.Objects.equals(property.getCity(), request.getCity()) ||
            !java.util.Objects.equals(property.getCountry(), request.getCountry()) ||
            !java.util.Objects.equals(property.getType(), request.getType()) ||
            !java.util.Objects.equals(property.getBedrooms(), request.getBedrooms()) ||
            !java.util.Objects.equals(property.getBathrooms(), request.getBathrooms()) ||
            !java.util.Objects.equals(property.getMaxGuests(), request.getMaxGuests()) ||
            !java.util.Objects.equals(property.getLatitude(), request.getLatitude()) ||
            !java.util.Objects.equals(property.getLongitude(), request.getLongitude());

        // Snapshot and set to PENDING ONLY if an Agent edits an APPROVED property
        if (isAgent && sensitiveFieldsChanged && property.getStatus() == PropertyStatus.APPROVED) {
            org.example.managementproject.model.PropertySnapshot snapshot = org.example.managementproject.model.PropertySnapshot.builder()
                .prevTitle(property.getTitle())
                .prevDescription(property.getDescription())
                .prevAddress(property.getAddress())
                .prevCity(property.getCity())
                .prevCountry(property.getCountry())
                .prevType(property.getType())
                .prevPricePerNight(property.getPricePerNight())
                .prevBedrooms(property.getBedrooms())
                .prevBathrooms(property.getBathrooms())
                .prevMaxGuests(property.getMaxGuests())
                .prevAvailable(property.isAvailable())
                .prevLatitude(property.getLatitude())
                .prevLongitude(property.getLongitude())
                .build();
            property.setPreviousState(snapshot);
            property.setStatus(PropertyStatus.PENDING);
            emailService.sendPropertyPendingNotification(property);
        }

        // Apply changes
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

        // Auto-geocode coordinates if not provided or address has changed
        Double lat = request.getLatitude();
        Double lng = request.getLongitude();
        if (lat == null || lng == null) {
            String fullAddress = request.getAddress() + ", " + request.getCity() + ", " + request.getCountry();
            double[] coords = geocodingService.geocode(fullAddress);
            if (coords != null) { lat = coords[0]; lng = coords[1]; }
        }
        property.setLatitude(lat);
        property.setLongitude(lng);

        // If it's an Agent and it WASN'T approved (e.g. REJECTED or already PENDING), 
        // keep it PENDING unless an admin intervention happened.
        // (Admins bypass all re-approval logic)
        if (isAdmin) {
            property.setStatus(PropertyStatus.APPROVED);
            property.setPreviousState(null);
        }

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
    @Transactional(readOnly = true)
    public Page<PropertyResponse> getPropertiesByCurrentAgent(Pageable pageable) {
        User agent = userService.getAuthenticatedUser();
        return propertyRepository.findByAgent(agent, pageable).map(this::toResponse);
    }

    // â”€â”€â”€ Helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

    private Property findPropertyById(Long id) {
        return propertyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Property not found with id: " + id));
    }

    @Transactional
    public PropertyResponse approveProperty(Long id) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Property not found"));
        property.setStatus(PropertyStatus.APPROVED);
        property.setPreviousState(null); // Clear snapshot if approved
        propertyRepository.save(property);
        emailService.sendPropertyApproved(property);   // â† add this
        return toResponse(property);
    }

    @Transactional
    public PropertyResponse rejectProperty(Long id) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Property not found"));
                
        if (property.getPreviousState() != null) {
            // Revert edit
            org.example.managementproject.model.PropertySnapshot prev = property.getPreviousState();
            property.setTitle(prev.getPrevTitle());
            property.setDescription(prev.getPrevDescription());
            property.setAddress(prev.getPrevAddress());
            property.setCity(prev.getPrevCity());
            property.setCountry(prev.getPrevCountry());
            property.setType(prev.getPrevType());
            property.setPricePerNight(prev.getPrevPricePerNight());
            property.setBedrooms(prev.getPrevBedrooms());
            property.setBathrooms(prev.getPrevBathrooms());
            property.setMaxGuests(prev.getPrevMaxGuests());
            property.setAvailable(prev.getPrevAvailable() != null ? prev.getPrevAvailable() : true);
            property.setLatitude(prev.getPrevLatitude());
            property.setLongitude(prev.getPrevLongitude());
            property.setPreviousState(null);
            property.setStatus(PropertyStatus.APPROVED);
        } else {
            // Brand new property rejection
            property.setStatus(PropertyStatus.REJECTED);
        }
        
        propertyRepository.save(property);
        emailService.sendPropertyRejected(property);   // â† add this
        return toResponse(property);
    }
    @Transactional(readOnly = true)
    public Page<PropertyResponse> getPendingProperties(Pageable pageable) {
        return propertyRepository.findByStatus(PropertyStatus.PENDING, pageable)
                .map(this::toResponse);
    }
    @Transactional(readOnly = true)
    public Page<PropertyResponse> getAllPropertiesForAdmin(Pageable pageable) {
        return propertyRepository.findAll(pageable).map(this::toResponse);
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

        Double avgRating = reviewRepository.findAverageRatingByPropertyId(property.getId());
        long reviewCount = reviewRepository.countByPropertyId(property.getId());

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
                .agentVerified(property.getAgent().isVerified())
                .createdAt(property.getCreatedAt())
                .averageRating(avgRating != null ? Math.round(avgRating * 10.0) / 10.0 : null)
                .reviewCount(reviewCount)
                .status(property.getStatus() != null ? property.getStatus().name() : null)
                .latitude(property.getLatitude())
                .longitude(property.getLongitude())
                .build();
    }
    /**
     * Retroactively geocode all existing properties that have no lat/lng.
     * Triggered via /properties/admin/geocode-all
     */
    @Transactional
    public int geocodeAllExistingProperties() {
        List<Property> ungeocoded = propertyRepository.findAll().stream()
                .filter(p -> p.getLatitude() == null || p.getLongitude() == null)
                .collect(Collectors.toList());

        int count = 0;
        for (Property p : ungeocoded) {
            String fullAddress = p.getAddress() + ", " + p.getCity() + ", " + p.getCountry();
            double[] coords = geocodingService.geocode(fullAddress);
            if (coords != null) {
                p.setLatitude(coords[0]);
                p.setLongitude(coords[1]);
                propertyRepository.save(p);
                count++;
            }
        }
        return count;
    }
}