package com.smartretail.service;

import com.smartretail.dto.CustomerRequest;
import com.smartretail.dto.CustomerResponse;

import java.util.List;

/** CustomerService interface */
public interface CustomerService {
    CustomerResponse createCustomer(CustomerRequest request);
    CustomerResponse getCustomerById(String id);
    List<CustomerResponse> getAllCustomers();
    List<CustomerResponse> searchCustomers(String name);
    CustomerResponse updateCustomer(String id, CustomerRequest request);
    void deleteCustomer(String id);
}
