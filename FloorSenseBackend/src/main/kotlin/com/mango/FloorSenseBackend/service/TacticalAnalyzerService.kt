package com.mango.FloorSenseBackend.service

import com.fasterxml.jackson.databind.ObjectMapper
import com.mango.FloorSenseBackend.model.FloorPlan
import com.mango.FloorSenseBackend.model.TacticalAnalysis
import com.mango.FloorSenseBackend.repository.FloorPlanRepository
import org.springframework.beans.factory.annotation.Value
import org.springframework.core.io.UrlResource
import org.springframework.stereotype.Service
import java.net.URI
import java.net.http.HttpClient
import java.net.http.HttpRequest
import java.net.http.HttpResponse
import java.util.Base64

@Service
class TacticalAnalyzerService(
    private val floorPlanRepository: FloorPlanRepository,
    @Value("\${spring.ai.google.genai.api-key}") private val apiKey: String
) {
    private val httpClient = HttpClient.newHttpClient()
    private val objectMapper = ObjectMapper()

    private val tacticalPrompt = """
        You are a tactical architect for a high-stakes competitive shooter like Rainbow Six Siege.
        Analyze this floor plan image based on these metrics:
        1. Choke Points: Hallway control and cover density.
        2. Loot Spawns: Resource clustering and accessibility.
        3. Flank Vulnerability: Sightline exposure and open concept.
        4. Sightline Analysis: Vantage points and intersection control.

        Return ONLY a raw JSON object with no markdown and no backticks with this structure:
        {
          "overallDefenseGrade": "S/A/B/C/D/F",
          "chokePointScore": 0,
          "defensiblePositions": ["name1", "name2"],
          "lootSpawnScore": 0,
          "keyLootZones": ["zone1", "zone2"],
          "flankVulnerabilityScore": 0,
          "highRiskZones": ["risk1", "risk2"],
          "sightlineScore": 0,
          "dominantVantagePoints": ["point1"],
          "combatSummary": "Brief summary text."
        }
    """.trimIndent()

    fun analyzeFloorPlan(plan: FloorPlan, imageBytes: ByteArray): FloorPlan {
        val base64Image = Base64.getEncoder().encodeToString(imageBytes)

        val requestBody = objectMapper.writeValueAsString(mapOf(
            "contents" to listOf(mapOf(
                "parts" to listOf(
                    mapOf("text" to tacticalPrompt),
                    mapOf("inline_data" to mapOf(
                        "mime_type" to "image/jpeg",
                        "data" to base64Image
                    ))
                )
            ))
        ))

        val request = HttpRequest.newBuilder()
            .uri(URI.create("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=$apiKey"))
            .header("Content-Type", "application/json")
            .POST(HttpRequest.BodyPublishers.ofString(requestBody))
            .build()

        val response = httpClient.send(request, HttpResponse.BodyHandlers.ofString())
        val responseBody = objectMapper.readTree(response.body())

        val text = responseBody.get("candidates")?.get(0)?.get("content")?.get("parts")?.get(0)?.get("text")?.asText()
            ?.replace("```json", "")?.replace("```", "")?.trim()
            ?: throw Exception("Gemini response empty")

        val analysis = objectMapper.readValue(text, TacticalAnalysis::class.java)
        plan.tacticalAnalysis = analysis
        plan.status = "analyzed"

        return floorPlanRepository.save(plan)
    }

    fun analyzePendingFloorPlans(): Int {
        val pendingPlans = floorPlanRepository.findByStatus("pending")
        var analyzedCount = 0

        for (plan in pendingPlans) {
            try {
                val imageBytes = UrlResource(plan.floorplanUrl).inputStream.readBytes()
                val base64Image = Base64.getEncoder().encodeToString(imageBytes)

                val requestBody = objectMapper.writeValueAsString(mapOf(
                    "contents" to listOf(mapOf(
                        "parts" to listOf(
                            mapOf("text" to tacticalPrompt),
                            mapOf("inline_data" to mapOf(
                                "mime_type" to "image/jpeg",
                                "data" to base64Image
                            ))
                        )
                    ))
                ))

                val request = HttpRequest.newBuilder()
                    .uri(URI.create("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + apiKey))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                    .build()

                val response = httpClient.send(request, HttpResponse.BodyHandlers.ofString())
                val responseBody = objectMapper.readTree(response.body())

                val text = responseBody.get("candidates")?.get(0)?.get("content")?.get("parts")?.get(0)?.get("text")?.asText()
                    ?.replace("```json", "")?.replace("```", "")?.trim()
                    ?: throw Exception("Gemini response empty")

                val analysis = objectMapper.readValue(text, TacticalAnalysis::class.java)
                plan.tacticalAnalysis = analysis
                plan.status = "analyzed"

                floorPlanRepository.save(plan)
                analyzedCount++
                println("Analysis Complete for: " + plan.address)

            } catch (e: Exception) {
                println("Analysis Failed for: " + plan.address + " Error: " + e.message)
            }
        }
        return analyzedCount
    }
}