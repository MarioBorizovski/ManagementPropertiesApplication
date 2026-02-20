package org.example.managementproject.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.managementproject.model.Role;
import org.example.managementproject.model.User;
import org.example.managementproject.repository.RoleRepository;
import org.example.managementproject.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        seedRoles();
        seedAdminUser();
    }

    // ─── Roles ────────────────────────────────────────────────────────────────

    private void seedRoles() {
        createRoleIfNotExists("ROLE_ADMIN");
        createRoleIfNotExists("ROLE_AGENT");
        createRoleIfNotExists("ROLE_USER");
        log.info("✅ Roles seeded successfully");
    }

    private void createRoleIfNotExists(String name) {
        if (roleRepository.findByName(name).isEmpty()) {
            roleRepository.save(Role.builder().name(name).build());
            log.info("   Created role: {}", name);
        }
    }

    // ─── Admin User ───────────────────────────────────────────────────────────

    private void seedAdminUser() {
        String adminEmail = "admin@gmail.com";

        if (userRepository.findByEmail(adminEmail).isEmpty()) {
            Role adminRole = roleRepository.findByName("ROLE_ADMIN")
                    .orElseThrow(() -> new RuntimeException("ROLE_ADMIN not found after seeding"));

            User admin = User.builder()
                    .firstName("Super")
                    .lastName("Admin")
                    .email(adminEmail)
                    .password(passwordEncoder.encode("admin123"))
                    .role(adminRole)
                    .active(true)
                    .build();

            userRepository.save(admin);
            log.info("✅ Admin user seeded successfully");
            log.info("   Email:    {}", adminEmail);
            log.info("   Password: admin123");
            log.info("   ⚠️  Change the admin password after first login!");
        } else {
            log.info("✅ Roles and admin already exist — skipping seed");
        }
    }
}