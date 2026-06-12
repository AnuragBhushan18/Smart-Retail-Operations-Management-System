package com.smartretail.service;

import com.smartretail.dto.SupplierRequest;
import com.smartretail.dto.SupplierResponse;

import java.util.List;

/** SupplierService interface - contract for supplier operations */
public interface SupplierService {
    SupplierResponse createSupplier(SupplierRequest request);
    SupplierResponse getSupplierById(String id);
    List<SupplierResponse> getAllSuppliers();
    SupplierResponse updateSupplier(String id, SupplierRequest request);
    void deleteSupplier(String id);
}
