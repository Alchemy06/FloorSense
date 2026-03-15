package com.mango.FloorSenseBackend.controller

import com.mango.FloorSenseBackend.model.FloorPlan
import com.mango.FloorSenseBackend.repository.FloorPlanRepository
import com.mango.FloorSenseBackend.service.RightmoveScraperService
import com.mango.FloorSenseBackend.service.TacticalAnalyzerService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = ["*"])
class FloorPlanController(
    private val floorPlanRepository: FloorPlanRepository,
    private val tacticalAnalyzerService: TacticalAnalyzerService,
    private val rightmoveScraperService: RightmoveScraperService
) {
    // Main endpoint - paste Rightmove URL, get back full analysis
    @PostMapping("/scrape-and-analyze")
    fun scrapeAndAnalyze(@RequestBody body: Map<String, String>): ResponseEntity<FloorPlan> {
        val url = body["url"] ?: return ResponseEntity.badRequest().build()

        // 1. Scrape and save to MongoDB
        val floorPlan = rightmoveScraperService.scrapeAndStore(url)
            ?: return ResponseEntity.internalServerError().build()

        // 2. Run Gemini analysis immediately on this property
        val imageBytes = org.springframework.core.io.UrlResource(floorPlan.floorplanUrl).inputStream.readBytes()
        val analyzed = tacticalAnalyzerService.analyzeFloorPlan(floorPlan, imageBytes)

        return ResponseEntity.ok(analyzed)
    }

    // Get all properties
    @GetMapping("/properties")
    fun getAllProperties(): List<FloorPlan> = floorPlanRepository.findAll()

    // Get only analyzed properties
    @GetMapping("/properties/analyzed")
    fun getAnalyzed(): List<FloorPlan> = floorPlanRepository.findByStatus("analyzed")

    // Get single property by ID
    @GetMapping("/properties/{id}")
    fun getById(@PathVariable id: String): FloorPlan? =
        floorPlanRepository.findById(id).orElse(null)
}