package com.mango.FloorSenseBackend.service

import com.fasterxml.jackson.databind.ObjectMapper
import com.mango.FloorSenseBackend.model.*
import com.mango.FloorSenseBackend.repository.PropertyRepository
import org.springframework.beans.factory.annotation.Value
import org.springframework.http.*
import org.springframework.stereotype.Service
import org.springframework.web.client.RestTemplate
import java.net.URI
import java.net.http.HttpClient
import java.net.http.HttpRequest
import java.net.http.HttpResponse
import java.time.Instant
import java.util.Base64

@Service
class AnalysisService(
    private val propertyRepository: PropertyRepository,
    private val restTemplate: RestTemplate,
    @Value("\${spring.ai.google.genai.api-key}") private val apiKey: String
) {
    private val httpClient = HttpClient.newHttpClient()
    private val objectMapper = ObjectMapper()
    private val scraperUrl = "http://192.248.158.35:3000/get-floorplan"

    fun findAll(): List<PropertyData> = propertyRepository.findAll()

    // --- SCRAPER ---
    fun scrapeAndStore(rightmoveUrl: String): PropertyData {
        val existing = propertyRepository.findAll().find { it.rightmoveUrl == rightmoveUrl }
        if (existing != null) return existing

        val headers = HttpHeaders().apply { contentType = MediaType.APPLICATION_JSON }
        val request = HttpEntity(ScraperRequest(rightmoveUrl), headers)
        val response = restTemplate.postForObject(scraperUrl, request, ScraperResponse::class.java)

        if (response?.success != true || response.data == null) {
            throw Exception("Scraper failed: ${response?.error}")
        }

        val property = PropertyData(
            rightmoveUrl = rightmoveUrl,
            address = response.data.address,
            primaryPrice = response.data.primaryPrice,
            secondaryPrice = response.data.secondaryPrice,
            keyFeatures = response.data.keyFeatures,
            description = response.data.description,
            floorplanUrl = response.data.floorplanUrl,
            analyzedAt = Instant.now()
        )
        return propertyRepository.save(property)
    }

    // --- GEMINI HELPER ---
    private fun callGemini(floorplanUrl: String, prompt: String): String {
        val imageBytes = java.net.URL(floorplanUrl).readBytes()
        val base64Image = Base64.getEncoder().encodeToString(imageBytes)

        val requestBody = objectMapper.writeValueAsString(mapOf(
            "contents" to listOf(mapOf(
                "parts" to listOf(
                    mapOf("text" to prompt),
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

        return responseBody
            .get("candidates")?.get(0)
            ?.get("content")?.get("parts")?.get(0)
            ?.get("text")?.asText()
            ?.replace("```json", "")?.replace("```", "")?.trim()
            ?: throw Exception("Empty response from Gemini")
    }

    // --- TACTICAL ---
    fun analyzeTactical(rightmoveUrl: String): PropertyData {
        val property = scrapeAndStore(rightmoveUrl)
        val floorplanUrl = property.floorplanUrl ?: throw Exception("No floorplan image found")

        val prompt = """
            You are a tactical architect for a high-stakes competitive shooter (like Rainbow Six Siege).
            Analyze this floor plan. Return ONLY raw JSON (no markdown):
            {
              "overallDefenseGrade": "S/A/B/C/D/F",
              "chokePointScore": 0-100,
              "defensiblePositions": ["room1", "room2"],
              "lootSpawnScore": 0-100,
              "keyLootZones": ["zone1"],
              "flankVulnerabilityScore": 0-100,
              "highRiskZones": ["zone1"],
              "sightlineScore": 0-100,
              "dominantVantagePoints": ["point1"],
              "combatSummary": "2-sentence summary."
            }
        """.trimIndent()

        val analysis = objectMapper.readValue(callGemini(floorplanUrl, prompt), TacticalAnalysis::class.java)
        val updated = property.copy(tacticalAnalysis = analysis)
        return propertyRepository.save(updated)
    }

    // --- NEURO ---
    fun analyzeNeuro(rightmoveUrl: String): PropertyData {
        val property = scrapeAndStore(rightmoveUrl)
        val floorplanUrl = property.floorplanUrl ?: throw Exception("No floorplan image found")

        val prompt = """
            You are an expert in neurodiversity and architectural design.
            Analyze this floor plan for how it might affect someone with autism or ADHD.
            Return ONLY raw JSON (no markdown):
            {
              "overallScore": "Good/Moderate/Poor",
              "autismConsiderations": ["consideration1"],
              "adhdConsiderations": ["consideration1"],
              "sensoryRisks": ["risk1"],
              "positiveFeatures": ["feature1"],
              "summary": "2-sentence summary."
            }
        """.trimIndent()

        val analysis = objectMapper.readValue(callGemini(floorplanUrl, prompt), NeuroAnalysis::class.java)
        val updated = property.copy(neuroAnalysis = analysis)
        return propertyRepository.save(updated)
    }

    // --- PROPERTY VALUE ---
    fun analyzeProperty(rightmoveUrl: String): PropertyData {
        val property = scrapeAndStore(rightmoveUrl)
        val floorplanUrl = property.floorplanUrl ?: throw Exception("No floorplan image found")

        val prompt = """
            You are a property valuation expert. Analyze this floor plan and assess how the layout
            might impact future house prices and marketability.
            Return ONLY raw JSON (no markdown):
            {
              "priceOutlook": "Positive/Neutral/Negative",
              "estimatedAppreciation": "e.g. 3-5% above average",
              "layoutStrengths": ["strength1"],
              "layoutWeaknesses": ["weakness1"],
              "marketabilityScore": 0-100,
              "summary": "2-sentence summary."
            }
        """.trimIndent()

        val analysis = objectMapper.readValue(callGemini(floorplanUrl, prompt), PropertyAnalysis::class.java)
        val updated = property.copy(propertyAnalysis = analysis)
        return propertyRepository.save(updated)
    }
}