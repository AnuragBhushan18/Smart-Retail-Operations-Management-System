package com.smartretail.controller;

import com.smartretail.dto.DashboardResponse;
import com.smartretail.service.DashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * ============================================================
 * DashboardController - REST API for Admin Dashboard Stats
 *
 * Base URL: /api/dashboard
 *
 * Endpoints:
 *   GET /api/dashboard/stats → Get aggregated system statistics
 * ============================================================
 */
@RestController
@RequestMapping("/dashboard")
@Tag(name = "Dashboard", description = "APIs for admin dashboard statistics and overview")
@CrossOrigin(origins = "*")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/stats")
    @Operation(
            summary = "Get dashboard statistics",
            description = "Returns an aggregated summary including: total counts for products, categories, " +
                          "suppliers, customers, and orders; order breakdown by status (pending/confirmed/shipped/delivered); " +
                          "total inventory value; and a list of low-stock products."
    )
    public ResponseEntity<DashboardResponse> getDashboardStats() {
        return ResponseEntity.ok(dashboardService.getDashboardStats());
    }
}
