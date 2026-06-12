package com.smartretail.seeder;

import com.smartretail.model.*;
import com.smartretail.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

/**
 * ============================================================
 * DataSeeder - Populates MongoDB with sample data on startup
 *
 * Implements CommandLineRunner so it runs once after Spring Boot starts.
 * Only seeds if the database is empty (idempotent).
 * ============================================================
 */
@Component
public class DataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

    private final CategoryRepository categoryRepository;
    private final SupplierRepository supplierRepository;
    private final ProductRepository  productRepository;
    private final CustomerRepository customerRepository;
    private final OrderRepository    orderRepository;

    public DataSeeder(CategoryRepository categoryRepository,
                      SupplierRepository supplierRepository,
                      ProductRepository productRepository,
                      CustomerRepository customerRepository,
                      OrderRepository orderRepository) {
        this.categoryRepository = categoryRepository;
        this.supplierRepository = supplierRepository;
        this.productRepository  = productRepository;
        this.customerRepository = customerRepository;
        this.orderRepository    = orderRepository;
    }

    @Override
    public void run(String... args) {
        if (categoryRepository.count() > 0) {
            log.info("Database already seeded. Skipping data seeder.");
            return;
        }

        log.info("=== Starting Data Seeder ===");

        // ── 1. Seed Categories ────────────────────────────────────────────────
        Category electronics = new Category();
        electronics.setName("Electronics");
        electronics.setDescription("Mobile phones, laptops, tablets and electronic gadgets");

        Category clothing = new Category();
        clothing.setName("Clothing & Apparel");
        clothing.setDescription("Men's, women's and children's clothing and accessories");

        Category groceries = new Category();
        groceries.setName("Groceries & Food");
        groceries.setDescription("Daily groceries, packaged food and beverages");

        Category furniture = new Category();
        furniture.setName("Furniture & Home");
        furniture.setDescription("Home furniture, décor and kitchen appliances");

        Category sports = new Category();
        sports.setName("Sports & Fitness");
        sports.setDescription("Sports equipment, gym accessories and outdoor gear");

        List<Category> savedCategories = categoryRepository.saveAll(
                List.of(electronics, clothing, groceries, furniture, sports));
        log.info("Seeded {} categories", savedCategories.size());

        Category elec   = savedCategories.get(0);
        Category cloth  = savedCategories.get(1);
        Category groc   = savedCategories.get(2);
        Category furn   = savedCategories.get(3);
        Category sport  = savedCategories.get(4);

        // ── 2. Seed Suppliers ─────────────────────────────────────────────────
        Supplier techCorp = new Supplier();
        techCorp.setName("TechCorp Distributors");
        techCorp.setContactNumber("9876543210");
        techCorp.setEmail("contact@techcorp.com");
        techCorp.setAddress("Plot 45, MIDC Industrial Area, Pune, Maharashtra - 411019");

        Supplier fashionHub = new Supplier();
        fashionHub.setName("FashionHub Wholesale");
        fashionHub.setContactNumber("8765432109");
        fashionHub.setEmail("orders@fashionhub.in");
        fashionHub.setAddress("78 Textile Market, Surat, Gujarat - 395003");

        Supplier freshFarm = new Supplier();
        freshFarm.setName("FreshFarm Agro");
        freshFarm.setContactNumber("7654321098");
        freshFarm.setEmail("supply@freshfarm.co.in");
        freshFarm.setAddress("12 Agro Park, Nashik, Maharashtra - 422001");

        Supplier homeStyle = new Supplier();
        homeStyle.setName("HomeStyle Interiors");
        homeStyle.setContactNumber("6543210987");
        homeStyle.setEmail("wholesale@homestyleint.com");
        homeStyle.setAddress("22 Furniture Hub, Jodhpur, Rajasthan - 342001");

        List<Supplier> savedSuppliers = supplierRepository.saveAll(
                List.of(techCorp, fashionHub, freshFarm, homeStyle));
        log.info("Seeded {} suppliers", savedSuppliers.size());

        Supplier s1 = savedSuppliers.get(0); // TechCorp
        Supplier s2 = savedSuppliers.get(1); // FashionHub
        Supplier s3 = savedSuppliers.get(2); // FreshFarm
        Supplier s4 = savedSuppliers.get(3); // HomeStyle

        // ── 3. Seed Products ──────────────────────────────────────────────────
        // Electronics
        Product p1 = makeProduct("Samsung Galaxy S24 Ultra", "128MP camera, 12GB RAM, 256GB storage, 5G enabled",
                89999.0, 45, "Samsung", elec.getId(), s1.getId(), "ACTIVE");
        Product p2 = makeProduct("Apple iPhone 15 Pro", "A17 Pro chip, titanium design, 48MP camera, 256GB",
                134900.0, 30, "Apple", elec.getId(), s1.getId(), "ACTIVE");
        Product p3 = makeProduct("Dell XPS 15 Laptop", "Intel Core i7, 16GB RAM, 512GB SSD, 4K OLED display",
                124999.0, 15, "Dell", elec.getId(), s1.getId(), "ACTIVE");
        Product p4 = makeProduct("Sony WH-1000XM5 Headphones", "Industry-leading noise cancellation, 30hr battery",
                26990.0, 60, "Sony", elec.getId(), s1.getId(), "ACTIVE");
        Product p5 = makeProduct("iPad Air 11-inch", "M2 chip, 8GB RAM, 256GB, Wi-Fi + Cellular",
                79900.0, 8, "Apple", elec.getId(), s1.getId(), "ACTIVE");

        // Clothing
        Product p6 = makeProduct("Levi's 511 Slim Fit Jeans", "Slim fit, stretch denim, mid-rise, 5-pocket styling",
                3499.0, 100, "Levi's", cloth.getId(), s2.getId(), "ACTIVE");
        Product p7 = makeProduct("Nike Air Max 270 Sneakers", "Max Air cushioning, breathable mesh upper",
                10995.0, 50, "Nike", cloth.getId(), s2.getId(), "ACTIVE");
        Product p8 = makeProduct("Allen Solly Formal Shirt", "100% cotton, slim fit, full sleeves, easy iron",
                1299.0, 200, "Allen Solly", cloth.getId(), s2.getId(), "ACTIVE");

        // Groceries
        Product p9 = makeProduct("Tata Tea Gold 500g", "Premium blend, rich aroma, 500g pack",
                249.0, 500, "Tata", groc.getId(), s3.getId(), "ACTIVE");
        Product p10 = makeProduct("Amul Butter 500g", "Pasteurised butter, rich & creamy, 500g",
                289.0, 300, "Amul", groc.getId(), s3.getId(), "ACTIVE");
        Product p11 = makeProduct("Fortune Basmati Rice 5kg", "Extra-long grain, aged basmati, premium quality",
                549.0, 5, "Fortune", groc.getId(), s3.getId(), "ACTIVE");

        // Furniture
        Product p12 = makeProduct("Ergonomic Office Chair", "Lumbar support, height adjustable, breathable mesh back",
                12999.0, 20, "DuraSeat", furn.getId(), s4.getId(), "ACTIVE");
        Product p13 = makeProduct("Wooden Study Desk", "Solid sheesham wood, 2 drawers, 120cm wide",
                8499.0, 12, "WoodCraft", furn.getId(), s4.getId(), "ACTIVE");

        // Sports
        Product p14 = makeProduct("Yonex Badminton Racket", "Graphite frame, 3U weight, string tension 20-26 lbs",
                2499.0, 0, "Yonex", sport.getId(), null, "OUT_OF_STOCK");
        Product p15 = makeProduct("Decathlon Yoga Mat", "6mm thick, anti-slip, eco-friendly TPE material",
                999.0, 150, "Domyos", sport.getId(), null, "ACTIVE");

        List<Product> savedProducts = productRepository.saveAll(
                List.of(p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12, p13, p14, p15));
        log.info("Seeded {} products", savedProducts.size());

        // ── 4. Seed Customers ─────────────────────────────────────────────────
        Customer c1 = makeCustomer("Arjun Mehta", "9876541230", "arjun.mehta@email.com",
                "12 Bandra West", "Mumbai", "Maharashtra", "400050", "India");
        Customer c2 = makeCustomer("Priya Sharma", "8765432100", "priya.sharma@gmail.com",
                "45 Koramangala", "Bengaluru", "Karnataka", "560034", "India");
        Customer c3 = makeCustomer("Rohit Verma", "7654321890", "rohit.verma@yahoo.com",
                "7 Connaught Place", "New Delhi", "Delhi", "110001", "India");
        Customer c4 = makeCustomer("Sneha Patel", "6543218900", "sneha.patel@outlook.com",
                "23 Navrangpura", "Ahmedabad", "Gujarat", "380009", "India");
        Customer c5 = makeCustomer("Vikram Nair", "9988776655", "vikram.nair@email.com",
                "88 MG Road", "Kochi", "Kerala", "682016", "India");

        List<Customer> savedCustomers = customerRepository.saveAll(
                List.of(c1, c2, c3, c4, c5));
        log.info("Seeded {} customers", savedCustomers.size());

        // ── 5. Seed Orders ────────────────────────────────────────────────────
        // Order 1 – DELIVERED
        Order o1 = makeOrder(savedCustomers.get(0).getId(), savedCustomers.get(0).getName(),
                List.of(
                    makeOrderItem(savedProducts.get(0).getId(), "Samsung Galaxy S24 Ultra", 1, 89999.0),
                    makeOrderItem(savedProducts.get(3).getId(), "Sony WH-1000XM5 Headphones", 1, 26990.0)
                ),
                116989.0, "DELIVERED", "Please deliver before 6 PM");

        // Order 2 – SHIPPED
        Order o2 = makeOrder(savedCustomers.get(1).getId(), savedCustomers.get(1).getName(),
                List.of(
                    makeOrderItem(savedProducts.get(1).getId(), "Apple iPhone 15 Pro", 1, 134900.0)
                ),
                134900.0, "SHIPPED", null);

        // Order 3 – CONFIRMED
        Order o3 = makeOrder(savedCustomers.get(2).getId(), savedCustomers.get(2).getName(),
                List.of(
                    makeOrderItem(savedProducts.get(5).getId(), "Levi's 511 Slim Fit Jeans", 2, 3499.0),
                    makeOrderItem(savedProducts.get(6).getId(), "Nike Air Max 270 Sneakers", 1, 10995.0)
                ),
                17993.0, "CONFIRMED", "Gift wrap requested");

        // Order 4 – PENDING
        Order o4 = makeOrder(savedCustomers.get(3).getId(), savedCustomers.get(3).getName(),
                List.of(
                    makeOrderItem(savedProducts.get(8).getId(), "Tata Tea Gold 500g", 5, 249.0),
                    makeOrderItem(savedProducts.get(9).getId(), "Amul Butter 500g", 3, 289.0),
                    makeOrderItem(savedProducts.get(10).getId(), "Fortune Basmati Rice 5kg", 2, 549.0)
                ),
                3160.0, "PENDING", null);

        // Order 5 – CANCELLED
        Order o5 = makeOrder(savedCustomers.get(4).getId(), savedCustomers.get(4).getName(),
                List.of(
                    makeOrderItem(savedProducts.get(11).getId(), "Ergonomic Office Chair", 1, 12999.0)
                ),
                12999.0, "CANCELLED", "Customer cancelled — changed mind");

        orderRepository.saveAll(List.of(o1, o2, o3, o4, o5));
        log.info("Seeded 5 orders");

        log.info("=== Data Seeding Complete! ===");
        log.info("  Categories : {}", categoryRepository.count());
        log.info("  Suppliers  : {}", supplierRepository.count());
        log.info("  Products   : {}", productRepository.count());
        log.info("  Customers  : {}", customerRepository.count());
        log.info("  Orders     : {}", orderRepository.count());
    }

    // ─── Helper Methods ───────────────────────────────────────────────────────

    private Product makeProduct(String name, String desc, Double price, int stock,
                                String brand, String categoryId, String supplierId, String status) {
        Product p = new Product();
        p.setName(name);
        p.setDescription(desc);
        p.setPrice(price);
        p.setStockQuantity(stock);
        p.setBrand(brand);
        p.setCategoryId(categoryId);
        p.setSupplierId(supplierId);
        p.setStatus(status);
        return p;
    }

    private Customer makeCustomer(String name, String phone, String email,
                                  String street, String city, String state,
                                  String pincode, String country) {
        Address address = new Address();
        address.setStreet(street);
        address.setCity(city);
        address.setState(state);
        address.setPincode(pincode);
        address.setCountry(country);

        Customer c = new Customer();
        c.setName(name);
        c.setPhone(phone);
        c.setEmail(email);
        c.setAddress(address);
        return c;
    }

    private OrderItem makeOrderItem(String productId, String productName,
                                    int qty, double unitPrice) {
        OrderItem item = new OrderItem();
        item.setProductId(productId);
        item.setProductName(productName);
        item.setQuantity(qty);
        item.setUnitPrice(unitPrice);
        item.setSubtotal(unitPrice * qty);
        return item;
    }

    private Order makeOrder(String customerId, String customerName,
                            List<OrderItem> items, Double total,
                            String status, String notes) {
        Order o = new Order();
        o.setCustomerId(customerId);
        o.setCustomerName(customerName);
        o.setItems(items);
        o.setTotalAmount(total);
        o.setStatus(status);
        o.setNotes(notes);
        o.setOrderDate(LocalDateTime.now().minusDays((long)(Math.random() * 30)));
        return o;
    }
}
