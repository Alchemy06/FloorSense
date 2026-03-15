package com.mango.FloorSenseBackend.service

import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import java.net.URI
import java.net.http.HttpClient
import java.net.http.HttpRequest
import java.net.http.HttpResponse
import java.util.Base64
import com.fasterxml.jackson.databind.ObjectMapper

@Service
class ElevenLabsService(
    @Value("\${elevenlabs.api-key}") private val apiKey: String,
    @Value("\${elevenlabs.voice-id:wBXNqKUATyqu0RtYt25i}") private val defaultVoiceId: String
) {
    private val httpClient = HttpClient.newHttpClient()
    private val objectMapper = ObjectMapper()

    private fun getAvailableVoice(): String {
        return try {
            val request = HttpRequest.newBuilder()
                .uri(URI.create("https://api.elevenlabs.io/v1/voices"))
                .header("xi-api-key", apiKey)
                .GET()
                .build()

            val response = httpClient.send(request, HttpResponse.BodyHandlers.ofString())
            val body = objectMapper.readTree(response.body())
            val voices = body.get("voices")

            if (voices != null && voices.size() > 0) {
                val voiceId = voices.get(0).get("voice_id").asText()
                println("Selected voice ID: $voiceId")
                voiceId
            } else {
                println("No voices found, using fallback voice ID")
                defaultVoiceId
            }
        } catch (e: Exception) {
            println("Error fetching voices: ${e.message}, using fallback")
            defaultVoiceId
        }
    }

    fun generateAudioNarrative(text: String): Map<String, String> {
        if (text.isBlank()) throw IllegalArgumentException("Narrative text is required")

        println("Converting narrative to speech with ElevenLabs...")

        val voiceId = getAvailableVoice()
        val url = "https://api.elevenlabs.io/v1/text-to-speech/$voiceId"

        val requestBody = objectMapper.writeValueAsString(mapOf(
            "text" to text,
            "model_id" to "eleven_turbo_v2_5",
            "voice_settings" to mapOf(
                "stability" to 0.5,
                "similarity_boost" to 0.75
            )
        ))

        val request = HttpRequest.newBuilder()
            .uri(URI.create(url))
            .header("xi-api-key", apiKey)
            .header("Content-Type", "application/json")
            .POST(HttpRequest.BodyPublishers.ofString(requestBody))
            .build()

        val response = httpClient.send(request, HttpResponse.BodyHandlers.ofByteArray())

        when (response.statusCode()) {
            401 -> throw Exception("Invalid ElevenLabs API key")
            404 -> throw Exception("Voice not found - check your voice ID")
            429 -> throw Exception("ElevenLabs rate limit exceeded, try again later")
        }

        val base64Audio = Base64.getEncoder().encodeToString(response.body())
        val audioDataUrl = "data:audio/mpeg;base64,$base64Audio"

        println("Audio generation successful (${base64Audio.length} chars)")

        return mapOf(
            "audioDataUrl" to audioDataUrl,
            "format" to "audio/mpeg"
        )
    }
}