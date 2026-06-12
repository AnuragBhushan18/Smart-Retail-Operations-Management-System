package com.smartretail.controller;

import com.smartretail.dto.SupplierRequest;
import com.smartretail.dto.SupplierResponse;
import com.smartretail.service.SupplierService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * ============================================================
 * SupplierController - REST API for Supplier Management
 *
 * Base URL: /api/suppliers
 *
 * Endpoints:
 *   POST   /api/suppliers           → Create a new supplier
 *   GET    /api/suppliers           → Get all suppliers
 *   GET    /api/suppliers/{id}      → Get supplier by ID
 *   PUT    /api/suppliers/{id}      → Update a supplier
 *   DELETE /api/suppliers/{id}      → Delete a supplier
 * ============================================================
 */
@RestController
@RequestMapping("/api/suppliers")
@Tag(name = "Supplier Management", description = "APIs for managing product suppliers")
@CrossOrigin(origins = "*")
public class SupplierController {

    private final SupplierService supplierService;

    public SupplierController(SupplierService supplierService) {
        this.supplierService = supplierService;
    }

    // ─── CREATE ───────────────────────────────────────────────────────────────

    @PostMapping
    @Operation(summary = "Create a new supplier", description = "Registers a new supplier. Email must be unique.")
    public ResponseEntity<SupplierResponse> createSupplier(
            @Valid @RequestBody SupplierRequest request) {
        SupplierResponse response = supplierService.createSupplier(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // ─── READ ─────────────────────────────────────────────────────────────────

    @GetMapping
    @Operation(summary = "Get all suppliers", description = "Returns a list of all registered suppliers.")
    public ResponseEntity<List<SupplierResponse>> getAllSuppliers() {
        return ResponseEntity.ok(supplierService.getAllSuppliers());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get supplier by ID", description = "Returns a single supplier by its MongoDB ID.")
    public ResponseEntity<SupplierResponse> getSupplierById(@PathVariable String id) {
        return ResponseEntity.ok(supplierService.getSupplierById(id));
    }

    // ─── UPDATE ───────────────────────────────────────────────────────────────

    @PutMapping("/{id}")
    @Operation(summary = "Update a supplier", description = "Updates an existing supplier's details.")
    public ResponseEntity<SupplierResponse> updateSupplier(
            @PathVariable String id,
            @Valid @RequestBody SupplierRequest request) {
        return ResponseEntity.ok(supplierService.updateSupplier(id, request));
    }

    // ─── DELETE ───────────────────────────────────────────────────────────────

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a supplier", description = "Permanently deletes a supplier by ID.")
    public ResponseEntity<Void> deleteSupplier(@PathVariable String id) {
        supplierService.deleteSupplier(id);
        return ResponseEntity.noContent().build();
    }
}
