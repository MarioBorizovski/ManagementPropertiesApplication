package org.example.managementproject.repository.specifications;

import jakarta.persistence.criteria.Predicate;
import org.example.managementproject.model.Property;
import org.example.managementproject.model.PropertyStatus;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class PropertySpecification {

    public static Specification<Property> withFilters(
            String city,
            String type,
            Double minPrice,
            Double maxPrice,
            Integer minBedrooms) {

        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            predicates.add(cb.equal(root.get("status"), PropertyStatus.APPROVED));
            predicates.add(cb.equal(root.get("available"), true));

            if (city != null && !city.isBlank()) {
                String searchStr = "%" + city.toLowerCase() + "%";
                predicates.add(cb.or(
                    cb.like(cb.lower(root.get("city")), searchStr),
                    cb.like(cb.lower(root.get("address")), searchStr),
                    cb.like(cb.lower(root.get("country")), searchStr),
                    cb.like(cb.lower(root.get("title")), searchStr)
                ));
            }

            if (type != null && !type.isBlank()) {
                predicates.add(cb.equal(root.get("type"), type));
            }

            if (minPrice != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("pricePerNight"), minPrice));
            }

            if (maxPrice != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("pricePerNight"), maxPrice));
            }

            if (minBedrooms != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("bedrooms"), minBedrooms));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}