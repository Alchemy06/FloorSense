package com.mango.FloorSenseBackend.model

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document

@Document(collection = "properties")
data class FloorPlan(
    @Id val id: String? = null,
    val address: String? = null,
    val primaryPrice: String? = null,
    val secondaryPrice: String? = null,
    val description: String? = null,
    val keyFeatures: List<String> = emptyList(),
    val floorplanUrl: String,
    var status: String = "pending",
    var tacticalAnalysis: TacticalAnalysis? = null
)

data class TacticalAnalysis(
    val overallDefenseGrade: String,
    val chokePointScore: Int,
    val defensiblePositions: List<String>,
    val lootSpawnScore: Int,
    val keyLootZones: List<String>,
    val flankVulnerabilityScore: Int,
    val highRiskZones: List<String>,
    val sightlineScore: Int,
    val dominantVantagePoints: List<String>,
    val combatSummary: String
)



