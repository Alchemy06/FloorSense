package com.mango.FloorSenseBackend.controller

import com.mango.FloorSenseBackend.model.FloorPlan
import com.mango.FloorSenseBackend.repository.FloorPlanRepository
import com.mango.FloorSenseBackend.service.TacticalAnalyzerService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/tactical")
@CrossOrigin(origins = ["*"])
class FloorPlanController(
    private val floorPlanRepository: FloorPlanRepository,
    private val analyzerService: TacticalAnalyzerService
) {

    @GetMapping("/feed")
    fun getAnalyzedProperties(): ResponseEntity<List<FloorPlan>> {
        val analyzedHouses = floorPlanRepository.findByStatus("analyzed")
        return ResponseEntity.ok(analyzedHouses)
    }

    @PostMapping("/trigger-analysis")
    fun triggerAnalysis(): ResponseEntity<String> {
        val processedCount = analyzerService.analyzePendingFloorPlans()
        return ResponseEntity.ok("Successfully analyzed $processedCount pending floor plans.")
    }

    @PostMapping("/roast")
    fun uploadAndRoastHouse(@RequestBody request: RoastRequest): ResponseEntity<FloorPlan> {
        val newPlan = FloorPlan(
            floorplanUrl = request.imageUrl,
            status = "pending"
        )
        floorPlanRepository.save(newPlan)
        analyzerService.analyzePendingFloorPlans()
        val analyzedPlan = floorPlanRepository.findById(newPlan.id!!).orElse(newPlan)
        return ResponseEntity.ok(analyzedPlan)
    }
}

data class RoastRequest(val imageUrl: String)