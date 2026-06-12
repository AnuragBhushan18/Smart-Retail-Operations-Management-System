package com.smartretail.controller;

import com.smartretail.dto.ProductRequest;
import com.smartretail.dto.ProductResponse;
import com.smartretail.dto.StockUpdateRequest;
import com.smartretail.service.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * ============================================================
 * ProductController - REST API for Product Management
 *
 * Base URL: /api/products
 *
 * Endpoints:
 *   POST   /api/products                        → Create product
 *   GET    /api/products                        → Get all products
 *   GET    /api/products/{id}                   → Get product by ID
 *   PUT    /api/products/{id}                   → Update product
 *   DELETE /api/products/{id}                   → Delete product
 *   GET    /api/products/search?name=...        → Search by name
 *   GET    /api/products/status/{status}        → Filter by status
 *   GET    /api/products/category/{categoryId}  → Filter by category
 *   GET    /api/products/supplier/{supplierId}  → Filter by supplier
 *   GET    /api/products/low-stock              → Get low-stock products
 *   PATCH  /api/products/{id}/stock             → Update stock quantity
 * ============================================================
 */
@RestController
@RequestMapping("/products")
@Tag(name = "Product Management", description = "APIs for managing products and inventory")
@CrossOrigin(origins = "*")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    // ─── CREATE ───────────────────────────────────────────────────────────────

    @PostMapping
    @Operation(summary = "Create a new product", description = "Adds a new product to the inventory. categoryId must be valid.")
    public ResponseEntity<ProductResponse> createProduct(
            @Valid @RequestBody ProductRequest request) {
        ProductResponse response = productService.createProduct(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // ─── READ ─────────────────────────────────────────────────────────────────

    @GetMapping
    @Operation(summary = "Get all products", description = "Returns a list of all products with category and supplier names resolved.")
    public ResponseEntity<List<ProductResponse>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get product by ID", description = "Returns a single product by its MongoDB ID.")
    public ResponseEntity<ProductResponse> getProductById(@PathVariable String id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    @GetMapping("/search")
    @Operation(summary = "Search products by name", description = "Returns products whose name contains the search keyword (case-insensitive).")
    public ResponseEntity<List<ProductResponse>> searchProducts(
            @RequestParam String name) {
        return ResponseEntity.ok(productService.searchProducts(name));
    }

    @GetMapping("/status/{status}")
    @Operation(summary = "Get products by status",
            description = "Filter products by status: ACTIVE, OUT_OF_STOCK, DISCONTINUED.")
    public ResponseEntity<List<ProductResponse>> getProductsByStatus(
            @PathVariable String status) {
        return ResponseEntity.ok(productService.getProductsByStatus(status));
    }

    @GetMapping("/category/{categoryId}")
    @Operation(summary = "Get products by category", description = "Returns all products belonging to the specified category.")
    public ResponseEntity<List<ProductResponse>> getProductsByCategory(
            @PathVariable String categoryId) {
        return ResponseEntity.ok(productService.getProductsByCategory(categoryId));
    }

    @GetMapping("/supplier/{supplierId}")
    @Operation(summary = "Get products by supplier", description = "Returns all products from the specified supplier.")
    public ResponseEntity<List<ProductResponse>> getProductsBySupplier(
            @PathVariable String supplierId) {
        return ResponseEntity.ok(productService.getProductsBySupplier(supplierId));
    }

    @GetMapping("/low-stock")
    @Operation(summary = "Get low-stock products",
            description = "Returns all products whose stock is below the configured threshold (default: 10).")
    public ResponseEntity<List<ProductResponse>> getLowStockProducts(
            @RequestParam(defaultValue = "10") int threshold) {
        return ResponseEntity.ok(productService.getLowStockProducts(threshold));
    }

    // ─── UPDATE ───────────────────────────────────────────────────────────────

    @PutMapping("/{id}")
    @Operation(summary = "Update a product", description = "Updates all fields of an existing product.")
    public ResponseEntity<ProductResponse> updateProduct(
            @PathVariable String id,
            @Valid @RequestBody ProductRequest request) {
        return ResponseEntity.ok(productService.updateProduct(id, request));
    }

    @PatchMapping("/{id}/stock")
    @Operation(summary = "Update stock quantity",
            description = "Increments or decrements stock quantity by the given delta value. Use negative values to reduce stock.")
    public ResponseEntity<ProductResponse> updateStock(
            @PathVariable String id,
            @Valid @RequestBody StockUpdateRequest request) {
        return ResponseEntity.ok(productService.updateStock(id, request));
    }

    // ─── DELETE ───────────────────────────────────────────────────────────────

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a product", description = "Permanently removes a product from inventory.")
    public ResponseEntity<Void> deleteProduct(@PathVariable String id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
}
