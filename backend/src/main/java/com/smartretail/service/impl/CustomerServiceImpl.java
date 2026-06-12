package com.smartretail.service.impl;

import com.smartretail.dto.CustomerRequest;
import com.smartretail.dto.CustomerResponse;
import com.smartretail.exception.DuplicateResourceException;
import com.smartretail.exception.ResourceNotFoundException;
import com.smartretail.model.Address;
import com.smartretail.model.Customer;
import com.smartretail.repository.CustomerRepository;
import com.smartretail.service.CustomerService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CustomerServiceImpl implements CustomerService {

    private static final Logger log = LoggerFactory.getLogger(CustomerServiceImpl.class);

    private final CustomerRepository customerRepository;

    public CustomerServiceImpl(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    @Override
    public CustomerResponse createCustomer(CustomerRequest request) {
        log.info("Creating customer: {}", request.getEmail());

        if (customerRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException(
                "Customer with email '" + request.getEmail() + "' already exists");
        }

        Address address = null;
        if (request.getAddress() != null) {
            address = new Address();
            address.setStreet(request.getAddress().getStreet());
            address.setCity(request.getAddress().getCity());
            address.setState(request.getAddress().getState());
            address.setPincode(request.getAddress().getPincode());
            address.setCountry(request.getAddress().getCountry());
        }

        Customer customer = new Customer();
        customer.setName(request.getName());
        customer.setPhone(request.getPhone());
        customer.setEmail(request.getEmail());
        customer.setAddress(address);

        Customer saved = customerRepository.save(customer);
        log.info("Customer created: {}", saved.getId());
        return mapToResponse(saved);
    }

    @Override
    public CustomerResponse getCustomerById(String id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer", "id", id));
        return mapToResponse(customer);
    }

    @Override
    public List<CustomerResponse> getAllCustomers() {
        return customerRepository.findAll().stream()
                .map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    public List<CustomerResponse> searchCustomers(String name) {
        return customerRepository.findByNameContainingIgnoreCase(name).stream()
                .map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    public CustomerResponse updateCustomer(String id, CustomerRequest request) {
        log.info("Updating customer: {}", id);

        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer", "id", id));

        if (customerRepository.existsByEmailAndIdNot(request.getEmail(), id)) {
            throw new DuplicateResourceException(
                "Email '" + request.getEmail() + "' is already used by another customer");
        }

        if (request.getAddress() != null) {
            Address address = new Address();
            address.setStreet(request.getAddress().getStreet());
            address.setCity(request.getAddress().getCity());
            address.setState(request.getAddress().getState());
            address.setPincode(request.getAddress().getPincode());
            address.setCountry(request.getAddress().getCountry());
            customer.setAddress(address);
        }

        customer.setName(request.getName());
        customer.setPhone(request.getPhone());
        customer.setEmail(request.getEmail());

        Customer updated = customerRepository.save(customer);
        return mapToResponse(updated);
    }

    @Override
    public void deleteCustomer(String id) {
        if (!customerRepository.existsById(id)) {
            throw new ResourceNotFoundException("Customer", "id", id);
        }
        customerRepository.deleteById(id);
        log.info("Customer deleted: {}", id);
    }

    private CustomerResponse mapToResponse(Customer customer) {
        CustomerResponse.AddressResponse addressResponse = null;
        if (customer.getAddress() != null) {
            addressResponse = new CustomerResponse.AddressResponse();
            addressResponse.setStreet(customer.getAddress().getStreet());
            addressResponse.setCity(customer.getAddress().getCity());
            addressResponse.setState(customer.getAddress().getState());
            addressResponse.setPincode(customer.getAddress().getPincode());
            addressResponse.setCountry(customer.getAddress().getCountry());
        }

        CustomerResponse response = new CustomerResponse();
        response.setId(customer.getId());
        response.setName(customer.getName());
        response.setPhone(customer.getPhone());
        response.setEmail(customer.getEmail());
        response.setAddress(addressResponse);
        response.setCreatedAt(customer.getCreatedAt());
        response.setUpdatedAt(customer.getUpdatedAt());
        return response;
    }
}
