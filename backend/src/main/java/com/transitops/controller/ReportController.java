package com.transitops.controller;

import com.transitops.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/summary")
    public ResponseEntity<ReportService.ReportSummaryResponse> getSummary() {
        return ResponseEntity.ok(reportService.getSummary());
    }

    @GetMapping("/export/csv")
    public ResponseEntity<byte[]> exportCsv() {
        String csvContent = reportService.exportVehicleSummaryCsv();
        byte[] csvBytes = csvContent.getBytes(java.nio.charset.StandardCharsets.UTF_8);

        return ResponseEntity.ok()
                .header(org.springframework.http.HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"vehicle_summary_report.csv\"")
                .contentType(org.springframework.http.MediaType.parseMediaType("text/csv"))
                .body(csvBytes);
    }
}
