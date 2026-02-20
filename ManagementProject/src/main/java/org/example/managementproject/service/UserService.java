package org.example.managementproject.service;

import lombok.RequiredArgsConstructor;
import org.example.managementproject.dto.request.UpdateUserRequest;
import org.example.managementproject.dto.response.UserResponse;
import org.example.managementproject.model.exception.ResourceNotFoundException;
import org.example.managementproject.model.Role;
import org.example.managementproject.model.User;
import org.example.managementproject.repository.RoleRepository;
import org.example.managementproject.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public UserResponse getUserById(Long id) {
        return toResponse(findUserById(id));
    }

    @Transactional
    public UserResponse updateUser(Long id, UpdateUserRequest request) {
        User user = findUserById(id);
        applyUpdates(user, request);
        return toResponse(userRepository.save(user));
    }

    @Transactional
    public void deleteUser(Long id) {
        User user = findUserById(id);
        userRepository.delete(user);
    }

    @Transactional
    public UserResponse changeUserRole(Long id, String roleName) {
        User user = findUserById(id);
        String fullRoleName = "ROLE_" + roleName.toUpperCase();
        Role role = roleRepository.findByName(fullRoleName)
                .orElseThrow(() -> new IllegalArgumentException("Role not found: " + fullRoleName));
        user.setRole(role);
        return toResponse(userRepository.save(user));
    }

    public UserResponse getCurrentUser() {
        return toResponse(getAuthenticatedUser());
    }

    @Transactional
    public UserResponse updateCurrentUser(UpdateUserRequest request) {
        User user = getAuthenticatedUser();
        applyUpdates(user, request);
        return toResponse(userRepository.save(user));
    }

    // ─── Helpers ──────────────────────────────────────────────────────────────

    private void applyUpdates(User user, UpdateUserRequest request) {
        if (request.getFirstName() != null) user.setFirstName(request.getFirstName());
        if (request.getLastName()  != null) user.setLastName(request.getLastName());
        if (request.getEmail()     != null) user.setEmail(request.getEmail());
        if (request.getPhone()     != null) user.setPhone(request.getPhone());
    }

    public User getAuthenticatedUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated user not found"));
    }

    private User findUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }

    public UserResponse toResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole().getName())
                .active(user.isActive())
                .createdAt(user.getCreatedAt())
                .build();
    }
}