package com.smartretail.service.impl;

import com.smartretail.config.AppConfig;
import com.smartretail.dto.ProductRequest;
import com.smartretail.dto.ProductResponse;
import com.smartretail.dto.StockUpdateRequest;
import com.smartretail.exception.ResourceNotFoundException;
import com.smartretail.model.Category;
import com.smartretail.model.Product;
import com.smartretail.model.Supplier;
import com.smartretail.repository.CategoryRepository;
import com.smartretail.repository.ProductRepository;
import com.smartretail.repository.SupplierRepository;
import com.smartretail.service.ProductService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductServiceImpl implements ProductService {

    private static final Logger log = LoggerFactory.getLogger(ProductServiceImpl.class);

    private final ProductRepository  productRepository;
    private final CategoryRepository categoryRepository;
    private final SupplierRepository supplierRepository;
    private final AppConfig          appConfig;

    public ProductServiceImpl(ProductRepository productRepository,
                              CategoryRepository categoryRepository,
                              SupplierRepository supplierRepository,
                              AppConfig appConfig) {
        this.productRepository  = productRepository;
        this.categoryRepository = categoryRepository;
        this.supplierRepository = supplierRepository;
        this.appConfig          = appConfig;
    }

    @Override
    public ProductResponse createProduct(ProductRequest request) {
        log.info("Creating product: {}", request.getName());

        categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException(
                    "Category", "id", request.getCategoryId()));

        if (request.getSupplierId() != null && !request.getSupplierId().isBlank()) {
            supplierRepository.findById(request.getSupplierId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                        "Supplier", "id", request.getSupplierId()));
        }

        String status = determineStatus(request.getStatus(), request.getStockQuantity());

        Product product = new Product();
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setStockQuantity(request.getStockQuantity());
        product.setBrand(request.getBrand());
        product.setCategoryId(request.getCategoryId());
        product.setSupplierId(request.getSupplierId());
        product.setStatus(status);

        Product saved = productRepository.save(product);
        log.info("Product created: {}", saved.getId());
        return mapToResponse(saved);
    }

    @Override
    public ProductResponse getProductById(String id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));
        return mapToResponse(product);
    }

    @Override
    public List<ProductResponse> getAllProducts() {
        return productRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProductResponse> getProductsByCategory(String categoryId) {
        categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", categoryId));
        return productRepository.findByCategoryId(categoryId).stream()
                .map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    public List<ProductResponse> getProductsBySupplier(String supplierId) {
        supplierRepository.findById(supplierId)
                .orElseThrow(() -> new ResourceNotFoundException("Supplier", "id", supplierId));
        return productRepository.findBySupplierId(supplierId).stream()
                .map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    public List<ProductResponse> searchProducts(String name) {
        return productRepository.findByNameContainingIgnoreCase(name).stream()
                .map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    public List<ProductResponse> getProductsByStatus(String status) {
        return productRepository.findByStatus(status.toUpperCase()).stream()
                .map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    public ProductResponse updateProduct(String id, ProductRequest request) {
        log.info("Updating product: {}", id);

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));

        categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException(
                    "Category", "id", request.getCategoryId()));

        if (request.getSupplierId() != null && !request.getSupplierId().isBlank()) {
            supplierRepository.findById(request.getSupplierId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                        "Supplier", "id", request.getSupplierId()));
        }

        String status = determineStatus(request.getStatus(), request.getStockQuantity());

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setStockQuantity(request.getStockQuantity());
        product.setBrand(request.getBrand());
        product.setCategoryId(request.getCategoryId());
        product.setSupplierId(request.getSupplierId());
        product.setStatus(status);

        Product updated = productRepository.save(product);
        return mapToResponse(updated);
    }

    @Override
    public ProductResponse updateStock(String id, StockUpdateRequest request) {
        log.info("Updating stock for product: {} | New quantity: {} | Reason: {}",
                id, request.getStockQuantity(), request.getReason());

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));

        if (request.getStockQuantity() == null || request.getStockQuantity() < 0) {
            throw new IllegalArgumentException("Stock quantity must be zero or positive");
        }

        product.setStockQuantity(request.getStockQuantity());

        // Auto-update status based on new stock
        if (request.getStockQuantity() == 0) {
            product.setStatus("OUT_OF_STOCK");
        } else if ("OUT_OF_STOCK".equals(product.getStatus())) {
            product.setStatus("ACTIVE");
        }

        Product updated = productRepository.save(product);
        log.info("Stock updated successfully for product: {}", product.getName());
        return mapToResponse(updated);
    }

    @Override
    public void deleteProduct(String id) {
        if (!productRepository.existsById(id)) {
            throw new ResourceNotFoundException("Product", "id", id);
        }
        productRepository.deleteById(id);
        log.info("Product deleted: {}", id);
    }

    @Override
    public List<ProductResponse> getLowStockProducts(int threshold) {
        return productRepository.findByStockQuantityLessThan(threshold).stream()
                .map(this::mapToResponse).collect(Collectors.toList());
    }

    private String determineStatus(String requestedStatus, int stock) {
        if (stock == 0) return "OUT_OF_STOCK";
        if (requestedStatus == null || requestedStatus.isBlank()) return "ACTIVE";
        return requestedStatus.toUpperCase();
    }

    private ProductResponse mapToResponse(Product product) {
        String categoryName = null;
        if (product.getCategoryId() != null) {
            categoryName = categoryRepository.findById(product.getCategoryId())
                    .map(Category::getName).orElse("Unknown");
        }

        String supplierName = null;
        if (product.getSupplierId() != null) {
            supplierName = supplierRepository.findById(product.getSupplierId())
                    .map(Supplier::getName).orElse("Unknown");
        }

        boolean isLowStock = product.getStockQuantity() != null &&
                             product.getStockQuantity() < appConfig.getLowStockThreshold();

        ProductResponse response = new ProductResponse();
        response.setId(product.getId());
        response.setName(product.getName());
        response.setDescription(product.getDescription());
        response.setPrice(product.getPrice());
        response.setStockQuantity(product.getStockQuantity());
        response.setBrand(product.getBrand());
        response.setStatus(product.getStatus());
        response.setCategoryId(product.getCategoryId());
        response.setCategoryName(categoryName);
        response.setSupplierId(product.getSupplierId());
        response.setSupplierName(supplierName);
        response.setLowStock(isLowStock);
        response.setCreatedAt(product.getCreatedAt());
        response.setUpdatedAt(product.getUpdatedAt());
        return response;
    }
}
