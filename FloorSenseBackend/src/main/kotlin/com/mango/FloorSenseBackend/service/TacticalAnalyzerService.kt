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
    @Value("\${claude.api-key}") private val apiKey: String
) {
    private val httpClient = HttpClient.newHttpClient()
    private val objectMapper = ObjectMapper()

    private val analysisPrompt = """
        You are analyzing a floor plan image of a property like a competitive gaming map. Provide a comprehensive tactical analysis with detailed reasoning for each metric.

        Return ONLY valid JSON (no markdown, no extra text):
        {
          "overallDefenseGrade": "A+/A/B+/B/C+/C/D/F",
          "overallDefenseReasoning": "Detailed explanation of why this property received this grade",
          "chokePointScore": 75,
          "chokePointExplanation": "Detailed explanation of chokepoint effectiveness",
          "defensiblePositions": [
            { "name": "Living Room", "reasoning": "Why this is defensible" }
          ],
          "lootSpawnScore": 82,
          "lootSpawnExplanation": "Detailed explanation of valuable asset zones",
          "keyLootZones": [
            { "name": "Kitchen", "reasoning": "Why this is valuable" }
          ],
          "flankVulnerabilityScore": 45,
          "flankExplanation": "Detailed explanation of flank vulnerabilities",
          "highRiskZones": [
            { "name": "Windows facing street", "reasoning": "Why this is high-risk" }
          ],
          "sightlineScore": 88,
          "sightlineExplanation": "Detailed explanation of surveillance potential",
          "dominantVantagePoints": [
            { "name": "Master Bedroom window", "reasoning": "Why this provides dominant control" }
          ],
          "combatSummary": "4-5 sentence comprehensive assessment of the property's tactical value",
          "gameifiedNarrative": "An engaging 2-3 minute audio briefing script (400-600 words) written in a compelling narrative style for gaming/tactical enthusiasts."
        }

        Analyze the floor plan and provide scores 0-100 for each metric. Include detailed tactical reasoning for every point.
    """.trimIndent()

    fun analyzeFloorPlan(plan: FloorPlan, imageBytes: ByteArray): FloorPlan {
        val base64Image = Base64.getEncoder().encodeToString(imageBytes)

        val requestBody = objectMapper.writeValueAsString(mapOf(
            "model" to "claude-sonnet-4-20250514",
            "max_tokens" to 4000,
            "messages" to listOf(mapOf(
                "role" to "user",
                "content" to listOf(
                    mapOf(
                        "type" to "image",
                        "source" to mapOf(
                            "type" to "base64",
                            "media_type" to "image/jpeg",
                            "data" to base64Image
                        )
                    ),
                    mapOf(
                        "type" to "text",
                        "text" to analysisPrompt
                    )
                )
            ))
        ))

        val request = HttpRequest.newBuilder()
            .uri(URI.create("https://api.anthropic.com/v1/messages"))
            .header("Content-Type", "application/json")
            .header("x-api-key", apiKey)
            .header("anthropic-version", "2023-06-01")
            .POST(HttpRequest.BodyPublishers.ofString(requestBody))
            .build()

        val response = httpClient.send(request, HttpResponse.BodyHandlers.ofString())
        val responseBody = objectMapper.readTree(response.body())

        val text = responseBody.get("content")?.get(0)?.get("text")?.asText()
            ?.replace("```json", "")?.replace("```", "")?.trim()
            ?: throw Exception("Claude response empty")

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
                analyzeFloorPlan(plan, imageBytes)
                analyzedCount++
                println("Analysis Complete for: ${plan.address}")
            } catch (e: Exception) {
                println("Analysis Failed for: ${plan.address} Error: ${e.message}")
            }
        }
        return analyzedCount
    }
}