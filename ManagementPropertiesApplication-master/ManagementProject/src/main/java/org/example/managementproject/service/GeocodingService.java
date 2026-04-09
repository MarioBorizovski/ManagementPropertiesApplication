package org.example.managementproject.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.List;
import java.util.Map;

/**
 * Calls the Google Maps Geocoding REST API to convert a property address
 * into latitude / longitude coordinates.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class GeocodingService {

    @Value("${app.google.maps.api-key}")
    private String apiKey;

    private final RestTemplate restTemplate;

    private static final String GEOCODE_URL =
            "https://maps.googleapis.com/maps/api/geocode/json";

    /**
     * Geocode a full address string.
     *
     * @param address e.g. "123 Main St, Ottawa, Canada"
     * @return double[]{lat, lng} or null if geocoding failed
     */
    @SuppressWarnings("unchecked")
    public double[] geocode(String address) {
        try {
            String url = UriComponentsBuilder.fromHttpUrl(GEOCODE_URL)
                    .queryParam("address", address)
                    .queryParam("key", apiKey)
                    .build()
                    .toUriString();

            Map<String, Object> response = restTemplate.getForObject(url, Map.class);

            if (response == null) return null;

            String status = (String) response.get("status");
            if (!"OK".equals(status)) {
                log.warn("Geocoding failed for '{}': status={}", address, status);
                return null;
            }

            List<Map<String, Object>> results = (List<Map<String, Object>>) response.get("results");
            if (results == null || results.isEmpty()) return null;

            Map<String, Object> geometry = (Map<String, Object>) results.get(0).get("geometry");
            Map<String, Object> location = (Map<String, Object>) geometry.get("location");

            double lat = ((Number) location.get("lat")).doubleValue();
            double lng = ((Number) location.get("lng")).doubleValue();

            log.info("Geocoded '{}' → [{}, {}]", address, lat, lng);
            return new double[]{lat, lng};

        } catch (Exception e) {
            log.error("Geocoding error for address '{}': {}", address, e.getMessage());
            return null;
        }
    }
}
