package com.mango.FloorSenseBackend.controller

import com.mango.FloorSenseBackend.model.FloorPlan
import com.mango.FloorSenseBackend.repository.FloorPlanRepository
import com.mango.FloorSenseBackend.service.RightmoveScraperService
import com.mango.FloorSenseBackend.service.TacticalAnalyzerService
import org.springframework.core.io.UrlResource
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
    @PostMapping("/submit/from-url")
    fun submitFromUrl(@RequestBody body: Map<String, String>): ResponseEntity<FloorPlan> {
        val url = body["url"] ?: return ResponseEntity.badRequest().build()
        val submittedBy = body["submittedBy"] ?: "Anonymous"

        if (!url.contains("rightmove.co.uk")) {
            return ResponseEntity.badRequest().build()
        }

        val floorPlan = rightmoveScraperService.scrapeAndStore(url, submittedBy)
            ?: return ResponseEntity.internalServerError().build()

        // Run analysis in background thread
        Thread {
            try {
                val imageBytes = UrlResource(floorPlan.floorplanUrl).inputStream.readBytes()
                tacticalAnalyzerService.analyzeFloorPlan(floorPlan, imageBytes)
            } catch (e: Exception) {
                println("Background analysis failed: ${e.message}")
            }
        }.start()

        return ResponseEntity.status(201).body(floorPlan)
    }

    // Get all analyzed properties
    @GetMapping("/floorplans")
    fun getAllProperties(): List<FloorPlan> = floorPlanRepository.findByStatus("analyzed")

    // Get single property by ID
    @GetMapping("/floorplans/{id}")
    fun getById(@PathVariable id: String): ResponseEntity<FloorPlan> {
        val plan = floorPlanRepository.findById(id).orElse(null)
            ?: return ResponseEntity.notFound().build()
        return ResponseEntity.ok(plan)
    }

    @PostMapping("/text-to-speech")
    fun textToSpeech(@RequestBody body: Map<String, String>): ResponseEntity<Map<String, String>> {
        val narrative = body["narrative"] ?: return ResponseEntity.badRequest().build()
        return try {
            val result = ElevenLabsService.generateAudioNarrative(narrative)
            ResponseEntity.ok(result)
        } catch (e: Exception) {
            ResponseEntity.internalServerError().body(mapOf("error" to (e.message ?: "Failed to generate audio")))
        }
    }
}