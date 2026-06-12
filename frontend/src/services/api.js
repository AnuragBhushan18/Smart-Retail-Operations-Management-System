import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// ── Categories ────────────────────────────────────────────────────────────────
export const categoryAPI = {
  getAll:    ()         => api.get('/categories'),
  getById:   (id)       => api.get(`/categories/${id}`),
  create:    (data)     => api.post('/categories', data),
  update:    (id, data) => api.put(`/categories/${id}`, data),
  delete:    (id)       => api.delete(`/categories/${id}`),
};

// ── Suppliers ─────────────────────────────────────────────────────────────────
export const supplierAPI = {
  getAll:    ()         => api.get('/suppliers'),
  getById:   (id)       => api.get(`/suppliers/${id}`),
  create:    (data)     => api.post('/suppliers', data),
  update:    (id, data) => api.put(`/suppliers/${id}`, data),
  delete:    (id)       => api.delete(`/suppliers/${id}`),
};

// ── Products ──────────────────────────────────────────────────────────────────
export const productAPI = {
  getAll:           ()              => api.get('/products'),
  getById:          (id)            => api.get(`/products/${id}`),
  create:           (data)          => api.post('/products', data),
  update:           (id, data)      => api.put(`/products/${id}`, data),
  delete:           (id)            => api.delete(`/products/${id}`),
  search:           (name)          => api.get(`/products/search?name=${name}`),
  getByCategory:    (categoryId)    => api.get(`/products/category/${categoryId}`),
  getBySupplier:    (supplierId)    => api.get(`/products/supplier/${supplierId}`),
  getByStatus:      (status)        => api.get(`/products/status/${status}`),
  getLowStock:      (threshold=10)  => api.get(`/products/low-stock?threshold=${threshold}`),
  updateStock:      (id, data)      => api.patch(`/products/${id}/stock`, data),
};

// ── Customers ─────────────────────────────────────────────────────────────────
export const customerAPI = {
  getAll:    ()         => api.get('/customers'),
  getById:   (id)       => api.get(`/customers/${id}`),
  create:    (data)     => api.post('/customers', data),
  update:    (id, data) => api.put(`/customers/${id}`, data),
  delete:    (id)       => api.delete(`/customers/${id}`),
  search:    (name)     => api.get(`/customers/search?name=${name}`),
};

// ── Orders ────────────────────────────────────────────────────────────────────
export const orderAPI = {
  getAll:           ()              => api.get('/orders'),
  getById:          (id)            => api.get(`/orders/${id}`),
  create:           (data)          => api.post('/orders', data),
  delete:           (id)            => api.delete(`/orders/${id}`),
  getByCustomer:    (customerId)    => api.get(`/orders/customer/${customerId}`),
  getByStatus:      (status)        => api.get(`/orders/status/${status}`),
  search:           (name)          => api.get(`/orders/search?customerName=${name}`),
  updateStatus:     (id, status)    => api.patch(`/orders/${id}/status`, { status }),
};

// ── Dashboard ─────────────────────────────────────────────────────────────────
export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
};

export default api;
