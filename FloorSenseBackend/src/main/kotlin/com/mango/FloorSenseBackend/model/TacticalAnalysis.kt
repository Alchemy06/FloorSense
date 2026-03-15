package com.mango.FloorSenseBackend.model

data class TacticalAnalysis(
    val overallDefenseGrade: String? = null,
    val chokePointScore: Int? = null,
    val defensiblePositions: List<String>? = null,
    val lootSpawnScore: Int? = null,
    val keyLootZones: List<String>? = null,
    val flankVulnerabilityScore: Int? = null,
    val highRiskZones: List<String>? = null,
    val sightlineScore: Int? = null,
    val dominantVantagePoints: List<String>? = null,
    val combatSummary: String? = null
)