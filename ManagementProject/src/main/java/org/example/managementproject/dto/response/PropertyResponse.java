package org.example.managementproject.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class PropertyResponse {
    private Long id;
    private String title;
    private String description;
    private String address;
    private String city;
    private String country;
    private String type;
    private Double pricePerNight;
    private Integer bedrooms;
    private Integer bathrooms;
    private Integer maxGuests;
    private boolean available;
    private String mainImageUrl;
    private List<String> imageUrls;
    private String agentName;
    private Long agentId;
    private LocalDateTime createdAt;
}