package com.mango.FloorSenseBackend.controller

import com.mango.FloorSenseBackend.model.PropertyData
import com.mango.FloorSenseBackend.service.AnalysisService
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile

data class AnalysisRequest(val rightmoveUrl: String)

@RestController
@RequestMapping("/api/analysis")
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

    // New: analyze by URL endpoint (orchestrates scraping + analysis)
    @PostMapping("/analyze-url")
    fun analyzeUrl(@RequestBody request: AnalysisRequest): ResponseEntity<PropertyData> {
        val result = analysisService.analyzeTactical(request.rightmoveUrl)
        return ResponseEntity.ok(result)
    }

    // New: upload floorplan image directly
    @PostMapping(value = ["/upload-floorplan"], consumes = [MediaType.MULTIPART_FORM_DATA_VALUE])
    fun uploadFloorplan(@RequestPart("file") file: MultipartFile): ResponseEntity<PropertyData> {
        val bytes = file.bytes
        val result = analysisService.analyzeUploadedFloorplan(bytes)
        return ResponseEntity.ok(result)
    }

    // New: fetch analysis by id
    @GetMapping("/{id}")
    fun getAnalysisById(@PathVariable id: String): ResponseEntity<PropertyData> {
        val found = analysisService.getAnalysisById(id) ?: return ResponseEntity.notFound().build()
        return ResponseEntity.ok(found)
    }
}


//Build it and test with:
//POST http://localhost:8080/api/analysis/analyze-url
//{"rightmoveUrl": "https://www.rightmove.co.uk/properties/170922350"}