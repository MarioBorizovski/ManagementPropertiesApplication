package org.example.managementproject.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.managementproject.dto.request.LoginRequest;
import org.example.managementproject.dto.request.RegisterRequest;
import org.example.managementproject.dto.response.AuthResponse;
import org.example.managementproject.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }
}