package org.example.managementproject.service;

import org.example.managementproject.dto.response.PropertyResponse;
import org.example.managementproject.model.Property;
import org.example.managementproject.model.User;
import org.example.managementproject.model.exception.ResourceNotFoundException;
import org.example.managementproject.repository.PropertyImageRepository;
import org.example.managementproject.repository.PropertyRepository;
import org.example.managementproject.repository.ReviewRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PropertyServiceTest {

    @Mock
    private PropertyRepository propertyRepository;
    
    @Mock
    private PropertyImageRepository propertyImageRepository;
    
    @Mock
    private ReviewRepository reviewRepository;

    @InjectMocks
    private PropertyService propertyService;

    @Test
    void getPropertyById_ShouldReturnResponse_WhenPropertyExists() {
        Long propertyId = 1L;
        Property property = new Property();
        property.setId(propertyId);
        property.setTitle("Luxury Villa");
        
        User agent = new User();
        agent.setFirstName("John");
        agent.setLastName("Doe");
        property.setAgent(agent);
        
        when(propertyRepository.findById(propertyId)).thenReturn(Optional.of(property));
        when(propertyImageRepository.findByProperty(property)).thenReturn(Collections.emptyList());
        when(reviewRepository.findAverageRatingByPropertyId(propertyId)).thenReturn(0.0);
        when(reviewRepository.countByPropertyId(propertyId)).thenReturn(0L);

        PropertyResponse response = propertyService.getPropertyById(propertyId);

        assertNotNull(response);
        assertEquals("Luxury Villa", response.getTitle());
        assertEquals("John Doe", response.getAgentName());
    }

    @Test
    void getPropertyById_ShouldThrowException_WhenPropertyDoesNotExist() {
        Long propertyId = 1L;
        when(propertyRepository.findById(propertyId)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> propertyService.getPropertyById(propertyId));
    }
}
