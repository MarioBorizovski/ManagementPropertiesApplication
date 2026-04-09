package org.example.managementproject.service;

import org.example.managementproject.model.PasswordResetToken;
import org.example.managementproject.model.User;
import org.example.managementproject.repository.PasswordResetTokenRepository;
import org.example.managementproject.repository.RoleRepository;
import org.example.managementproject.repository.UserRepository;
import org.example.managementproject.security.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock private UserRepository userRepository;
    @Mock private RoleRepository roleRepository;
    @Mock private PasswordResetTokenRepository resetTokenRepository;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private JwtService jwtService;
    @Mock private AuthenticationManager authenticationManager;
    @Mock private EmailService emailService;

    @InjectMocks
    private AuthService authService;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(authService, "frontendUrl", "http://localhost:3000");
    }

    @Test
    void testForgotPassword_UserExists_TokenGeneratedAndEmailSent() {
        // Arrange
        String email = "admin@gmail.com";
        User user = new User();
        user.setEmail(email);
        user.setFirstName("Admin");

        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));

        // Act
        authService.forgotPassword(email);

        // Assert
        verify(resetTokenRepository, times(1)).save(any(PasswordResetToken.class));
        verify(emailService, times(1)).sendPasswordResetEmail(eq(email), eq("Admin"), contains("http://localhost:3000/reset-password?token="));
    }

    @Test
    void testForgotPassword_UserDoesNotExist_SilentlyReturns() {
        // Arrange
        String email = "unknown@gmail.com";
        when(userRepository.findByEmail(email)).thenReturn(Optional.empty());

        // Act
        authService.forgotPassword(email);

        // Assert
        verify(resetTokenRepository, never()).save(any());
        verify(emailService, never()).sendPasswordResetEmail(anyString(), anyString(), anyString());
    }

    @Test
    void testResetPassword_ValidToken_PasswordUpdated() {
        // Arrange
        String token = "valid-token";
        String newPassword = "newPassword123";
        User user = new User();
        user.setPassword("oldHash");

        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setToken(token);
        resetToken.setUser(user);
        resetToken.setExpiryDate(LocalDateTime.now().plusMinutes(10));
        resetToken.setUsed(false);

        when(resetTokenRepository.findByTokenAndUsedFalse(token)).thenReturn(Optional.of(resetToken));
        when(passwordEncoder.encode(newPassword)).thenReturn("newHash");

        // Act
        authService.resetPassword(token, newPassword);

        // Assert
        assertEquals("newHash", user.getPassword());
        assertTrue(resetToken.isUsed());
        verify(userRepository, times(1)).save(user);
        verify(resetTokenRepository, times(1)).save(resetToken);
    }

    @Test
    void testResetPassword_ExpiredToken_ThrowsException() {
        // Arrange
        String token = "expired-token";
        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setExpiryDate(LocalDateTime.now().minusMinutes(5)); // expired 5 mins ago
        resetToken.setUsed(false);

        when(resetTokenRepository.findByTokenAndUsedFalse(token)).thenReturn(Optional.of(resetToken));

        // Act & Assert
        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            authService.resetPassword(token, "newPassword");
        });

        assertEquals("Reset token has expired. Please request a new one.", exception.getMessage());
        verify(userRepository, never()).save(any());
    }

    @Test
    void testResetPassword_InvalidToken_ThrowsException() {
        // Arrange
        String token = "invalid-token";
        when(resetTokenRepository.findByTokenAndUsedFalse(token)).thenReturn(Optional.empty());

        // Act & Assert
        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            authService.resetPassword(token, "newPassword");
        });

        assertEquals("Invalid or expired reset token", exception.getMessage());
    }
}
