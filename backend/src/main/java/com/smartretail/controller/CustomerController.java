package com.smartretail.controller;

import com.smartretail.dto.CustomerRequest;
import com.smartretail.dto.CustomerResponse;
import com.smartretail.service.CustomerService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * ============================================================
 * CustomerController - REST API for Customer Management
 *
 * Base URL: /api/customers
 *
 * Endpoints:
 *   POST   /api/customers               → Register a new customer
 *   GET    /api/customers               → Get all customers
 *   GET    /api/customers/{id}          → Get customer by ID
 *   GET    /api/customers/search?name=  → Search customers by name
 *   PUT    /api/customers/{id}          → Update customer
 *   DELETE /api/customers/{id}          → Delete customer
 * ============================================================
 */
@RestController
@RequestMapping("/customers")
@Tag(name = "Customer Management", description = "APIs for managing retail customers")
@CrossOrigin(origins = "*")
public class CustomerController {

    private final CustomerService customerService;

    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    // ─── CREATE ───────────────────────────────────────────────────────────────

    @PostMapping
    @Operation(summary = "Register a new customer",
            description = "Creates a new customer profile with optional embedded address. Email must be unique.")
    public ResponseEntity<CustomerResponse> createCustomer(
            @Valid @RequestBody CustomerRequest request) {
        CustomerResponse response = customerService.createCustomer(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // ─── READ ─────────────────────────────────────────────────────────────────

    @GetMapping
    @Operation(summary = "Get all customers", description = "Returns a list of all customers.")
    public ResponseEntity<List<CustomerResponse>> getAllCustomers() {
        return ResponseEntity.ok(customerService.getAllCustomers());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get customer by ID", description = "Returns a single customer by their MongoDB ID.")
    public ResponseEntity<CustomerResponse> getCustomerById(@PathVariable String id) {
        return ResponseEntity.ok(customerService.getCustomerById(id));
    }

    @GetMapping("/search")
    @Operation(summary = "Search customers by name",
            description = "Returns customers whose name contains the search keyword (case-insensitive).")
    public ResponseEntity<List<CustomerResponse>> searchCustomers(
            @RequestParam String name) {
        return ResponseEntity.ok(customerService.searchCustomers(name));
    }

    // ─── UPDATE ───────────────────────────────────────────────────────────────

    @PutMapping("/{id}")
    @Operation(summary = "Update customer details",
            description = "Updates an existing customer's profile including their address.")
    public ResponseEntity<CustomerResponse> updateCustomer(
            @PathVariable String id,
            @Valid @RequestBody CustomerRequest request) {
        return ResponseEntity.ok(customerService.updateCustomer(id, request));
    }

    // ─── DELETE ───────────────────────────────────────────────────────────────

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a customer", description = "Permanently removes a customer from the system.")
    public ResponseEntity<Void> deleteCustomer(@PathVariable String id) {
        customerService.deleteCustomer(id);
        return ResponseEntity.noContent().build();
    }
}
