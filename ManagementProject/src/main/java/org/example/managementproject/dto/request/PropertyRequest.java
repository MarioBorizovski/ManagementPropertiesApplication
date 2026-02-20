package org.example.managementproject.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class PropertyRequest {
    @NotBlank
    private String title;

    private String description;

    @NotBlank
    private String address;

    @NotBlank
    private String city;

    @NotBlank
    private String country;

    @NotBlank
    private String type; // e.g. APARTMENT, HOUSE, VILLA, OFFICE

    @NotNull
    @Positive
    private Double pricePerNight;

    @Min(0)
    private Integer bedrooms;

    @Min(0)
    private Integer bathrooms;

    @Min(1)
    private Integer maxGuests;

    private boolean available = true;
}