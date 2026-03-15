package com.mango.FloorSenseBackend.model

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document
import java.util.Date

@Document(collection = "floorplans")
data class FloorPlan(
    @Id val id: String? = null,
    val address: String? = null,
    val primaryPrice: String? = null,
    val secondaryPrice: String? = null,
    val description: String? = null,
    val keyFeatures: List<String> = emptyList(),
    val floorplanUrl: String,
    var status: String = "pending",
    var tacticalAnalysis: TacticalAnalysis? = null,
    val submittedBy: String = "Anonymous",
    val submittedAt: Date = Date()
)

data class TacticalAnalysis(
    val overallDefenseGrade: String,
    val overallDefenseReasoning: String? = null,
    val chokePointScore: Int,
    val chokePointExplanation: String? = null,
    val defensiblePositions: List<NamedItem> = emptyList(),
    val lootSpawnScore: Int,
    val lootSpawnExplanation: String? = null,
    val keyLootZones: List<NamedItem> = emptyList(),
    val flankVulnerabilityScore: Int,
    val flankExplanation: String? = null,
    val highRiskZones: List<NamedItem> = emptyList(),
    val sightlineScore: Int,
    val sightlineExplanation: String? = null,
    val dominantVantagePoints: List<NamedItem> = emptyList(),
    val combatSummary: String,
    val gameifiedNarrative: String? = null
)

data class NamedItem(
    val name: String,
    val reasoning: String? = null
)


