package org.example.managementproject.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PropertySnapshot {
    private String prevTitle;
    
    @Column(columnDefinition = "TEXT")
    private String prevDescription;
    
    private String prevAddress;
    private String prevCity;
    private String prevCountry;
    private String prevType;
    private Double prevPricePerNight;
    private Integer prevBedrooms;
    private Integer prevBathrooms;
    private Integer prevMaxGuests;
    private Boolean prevAvailable;
    private Double prevLatitude;
    private Double prevLongitude;
}
