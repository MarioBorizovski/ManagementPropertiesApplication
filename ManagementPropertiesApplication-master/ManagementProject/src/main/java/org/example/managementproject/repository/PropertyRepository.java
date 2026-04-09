package org.example.managementproject.repository;

import org.example.managementproject.model.Property;
import org.example.managementproject.model.PropertyStatus;
import org.example.managementproject.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface PropertyRepository extends JpaRepository<Property, Long>, JpaSpecificationExecutor<Property> {

    Page<Property> findAll(Pageable pageable);

    Page<Property> findByAgent(User agent, Pageable pageable);

    Page<Property> findByStatus(PropertyStatus status, Pageable pageable);


}