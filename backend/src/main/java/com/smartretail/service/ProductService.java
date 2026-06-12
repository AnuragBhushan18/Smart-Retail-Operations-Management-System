package com.smartretail.service;

import com.smartretail.dto.ProductRequest;
import com.smartretail.dto.ProductResponse;
import com.smartretail.dto.StockUpdateRequest;

import java.util.List;

/** ProductService interface - contract for product operations */
public interface ProductService {
    ProductResponse createProduct(ProductRequest request);
    ProductResponse getProductById(String id);
    List<ProductResponse> getAllProducts();
    List<ProductResponse> getProductsByCategory(String categoryId);
    List<ProductResponse> getProductsBySupplier(String supplierId);
    List<ProductResponse> searchProducts(String name);
    List<ProductResponse> getProductsByStatus(String status);
    ProductResponse updateProduct(String id, ProductRequest request);
    ProductResponse updateStock(String id, StockUpdateRequest request);
    void deleteProduct(String id);
    List<ProductResponse> getLowStockProducts(int threshold);
}
