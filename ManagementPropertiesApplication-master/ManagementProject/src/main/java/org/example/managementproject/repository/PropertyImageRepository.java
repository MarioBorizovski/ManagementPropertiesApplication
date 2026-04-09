package org.example.managementproject.repository;

import org.example.managementproject.model.Property;
import org.example.managementproject.model.PropertyImage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PropertyImageRepository extends JpaRepository<PropertyImage, Long> {
    List<PropertyImage> findByProperty(Property property);
    Optional<PropertyImage> findByPropertyAndIsMainTrue(Property property);
}