package com.smartretail.service.impl;

import com.smartretail.dto.SupplierRequest;
import com.smartretail.dto.SupplierResponse;
import com.smartretail.exception.DuplicateResourceException;
import com.smartretail.exception.ResourceNotFoundException;
import com.smartretail.model.Supplier;
import com.smartretail.repository.SupplierRepository;
import com.smartretail.service.SupplierService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SupplierServiceImpl implements SupplierService {

    private static final Logger log = LoggerFactory.getLogger(SupplierServiceImpl.class);

    private final SupplierRepository supplierRepository;
    private final com.smartretail.repository.ProductRepository productRepository;

    public SupplierServiceImpl(SupplierRepository supplierRepository,
                               com.smartretail.repository.ProductRepository productRepository) {
        this.supplierRepository = supplierRepository;
        this.productRepository = productRepository;
    }

    @Override
    public SupplierResponse createSupplier(SupplierRequest request) {
        log.info("Creating supplier with email: {}", request.getEmail());

        if (supplierRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException(
                "Supplier with email '" + request.getEmail() + "' already exists");
        }

        Supplier supplier = new Supplier();
        supplier.setName(request.getName());
        supplier.setContactNumber(request.getContactNumber());
        supplier.setEmail(request.getEmail());
        supplier.setAddress(request.getAddress());

        Supplier saved = supplierRepository.save(supplier);
        log.info("Supplier created: {}", saved.getId());
        return mapToResponse(saved);
    }

    @Override
    public SupplierResponse getSupplierById(String id) {
        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Supplier", "id", id));
        return mapToResponse(supplier);
    }

    @Override
    public List<SupplierResponse> getAllSuppliers() {
        return supplierRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public SupplierResponse updateSupplier(String id, SupplierRequest request) {
        log.info("Updating supplier: {}", id);

        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Supplier", "id", id));

        if (supplierRepository.existsByEmailAndIdNot(request.getEmail(), id)) {
            throw new DuplicateResourceException(
                "Email '" + request.getEmail() + "' is already used by another supplier");
        }

        supplier.setName(request.getName());
        supplier.setContactNumber(request.getContactNumber());
        supplier.setEmail(request.getEmail());
        supplier.setAddress(request.getAddress());

        Supplier updated = supplierRepository.save(supplier);
        return mapToResponse(updated);
    }

    @Override
    public void deleteSupplier(String id) {
        if (!supplierRepository.existsById(id)) {
            throw new ResourceNotFoundException("Supplier", "id", id);
        }
        if (productRepository.existsBySupplierId(id)) {
            throw new IllegalArgumentException("Cannot delete supplier because there are active products associated with it");
        }
        supplierRepository.deleteById(id);
        log.info("Supplier deleted: {}", id);
    }

    private SupplierResponse mapToResponse(Supplier supplier) {
        SupplierResponse response = new SupplierResponse();
        response.setId(supplier.getId());
        response.setName(supplier.getName());
        response.setContactNumber(supplier.getContactNumber());
        response.setEmail(supplier.getEmail());
        response.setAddress(supplier.getAddress());
        response.setCreatedAt(supplier.getCreatedAt());
        response.setUpdatedAt(supplier.getUpdatedAt());
        return response;
    }
}
