package com.mango.FloorSenseBackend.service

import com.mango.FloorSenseBackend.dto.PlaywrightResponse
import com.mango.FloorSenseBackend.model.FloorPlan
import com.mango.FloorSenseBackend.repository.FloorPlanRepository
import org.springframework.stereotype.Service
import org.springframework.web.client.RestClient

@Service
class RightmoveScraperService(private val floorPlanRepository: FloorPlanRepository) {
    private val restClient = RestClient.create()

    fun scrapeAndStore(rightmoveUrl: String, submittedBy: String = "Anonymous"): FloorPlan? {
        val url = "http://playwright-mcp:3000/get-floorplan"

        return try {
            val response = restClient.post()
                .uri(url)
                .body(mapOf("url" to rightmoveUrl))
                .retrieve()
                .body(PlaywrightResponse::class.java)

            if (response?.success == true) {
                floorPlanRepository.save(response.data.toEntity(submittedBy))
            } else null
        } catch (e: Exception) {
            println("Scrape failed: ${e.message}")
            null
        }
    }
}