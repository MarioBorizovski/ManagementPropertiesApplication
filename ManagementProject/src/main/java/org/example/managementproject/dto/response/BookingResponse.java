package org.example.managementproject.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class BookingResponse {
    private Long id;
    private Long propertyId;
    private String propertyTitle;
    private String propertyCity;
    private Long userId;
    private String userName;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private int guests;
    private Double totalPrice;
    private String status;       // PENDING, CONFIRMED, CANCELLED, REJECTED
    private String specialRequests;
    private LocalDateTime createdAt;
}