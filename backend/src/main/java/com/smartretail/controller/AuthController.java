package com.smartretail.controller;

import com.smartretail.dto.LoginRequest;
import com.smartretail.dto.LoginResponse;
import com.smartretail.model.Admin;
import com.smartretail.repository.AdminRepository;
import com.smartretail.service.JwtService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * ============================================================
 * AuthController - Handles Admin login and token creation.
 * ============================================================
 */
@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final AdminRepository adminRepository;
    private final JwtService jwtService;

    public AuthController(AuthenticationManager authenticationManager,
                          AdminRepository adminRepository,
                          JwtService jwtService) {
        this.authenticationManager = authenticationManager;
        this.adminRepository = adminRepository;
        this.jwtService = jwtService;
    }

    /**
     * POST /api/auth/login
     * Authenticate admin credentials and return JWT token.
     */
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        // Authenticate credentials via Spring Security AuthenticationManager
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        // Fetch Admin details from database to construct response
        Admin admin = adminRepository.findByUsername(request.getUsername())
                .or(() -> adminRepository.findByEmail(request.getUsername()))
                .orElseThrow(() -> new UsernameNotFoundException("Admin not found with identifier: " + request.getUsername()));

        // Generate JWT token
        String token = jwtService.generateToken(admin.getUsername());

        LoginResponse response = LoginResponse.builder()
                .token(token)
                .username(admin.getUsername())
                .email(admin.getEmail())
                .name(admin.getName())
                .role(admin.getRole())
                .build();

        return ResponseEntity.ok(response);
    }
}
