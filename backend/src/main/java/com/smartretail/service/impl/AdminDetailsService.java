package com.smartretail.service.impl;

import com.smartretail.model.Admin;
import com.smartretail.repository.AdminRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

/**
 * ============================================================
 * AdminDetailsService - Loads admin credentials for Spring Security.
 * ============================================================
 */
@Service
public class AdminDetailsService implements UserDetailsService {

    private final AdminRepository adminRepository;

    public AdminDetailsService(AdminRepository adminRepository) {
        this.adminRepository = adminRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String usernameOrEmail) throws UsernameNotFoundException {
        // Try finding by username first, then by email
        Admin admin = adminRepository.findByUsername(usernameOrEmail)
                .or(() -> adminRepository.findByEmail(usernameOrEmail))
                .orElseThrow(() -> new UsernameNotFoundException("Admin not found with username or email: " + usernameOrEmail));

        if (!admin.isActive()) {
            throw new UsernameNotFoundException("Admin account is inactive");
        }

        // Map role to SimpleGrantedAuthority. Spring Security expects "ROLE_*" prefix.
        String role = admin.getRole() != null ? admin.getRole() : "ADMIN";
        String authority = role.startsWith("ROLE_") ? role : "ROLE_" + role;

        return new User(
                admin.getUsername(),
                admin.getPassword(),
                admin.isActive(),
                true, // accountNonExpired
                true, // credentialsNonExpired
                true, // accountNonLocked
                Collections.singletonList(new SimpleGrantedAuthority(authority))
        );
    }
}
