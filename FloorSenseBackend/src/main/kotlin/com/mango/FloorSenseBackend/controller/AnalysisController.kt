package com.mango.FloorSenseBackend.controller

import com.mango.FloorSenseBackend.model.PropertyData
import com.mango.FloorSenseBackend.service.AnalysisService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

data class AnalysisRequest(val rightmoveUrl: String)

@RestController
@RequestMapping("/api/analyse")
@CrossOrigin(origins = ["*"])
class AnalysisController(private val analysisService: AnalysisService) {

    @PostMapping("/tactical")
    fun tactical(@RequestBody request: AnalysisRequest): ResponseEntity<PropertyData> =
        ResponseEntity.ok(analysisService.analyzeTactical(request.rightmoveUrl))

    @PostMapping("/neuro")
    fun neuro(@RequestBody request: AnalysisRequest): ResponseEntity<PropertyData> =
        ResponseEntity.ok(analysisService.analyzeNeuro(request.rightmoveUrl))

    @PostMapping("/property")
    fun property(@RequestBody request: AnalysisRequest): ResponseEntity<PropertyData> =
        ResponseEntity.ok(analysisService.analyzeProperty(request.rightmoveUrl))

    @GetMapping("/all")
    fun getAll(): ResponseEntity<List<PropertyData>> =
        // Call the service's new method instead of accessing the repo directly
        ResponseEntity.ok(analysisService.findAll())
}


//Build it and test with:
//POST http://localhost:8080/api/analyse/tactical
//{"rightmoveUrl": "https://www.rightmove.co.uk/properties/170922350"}