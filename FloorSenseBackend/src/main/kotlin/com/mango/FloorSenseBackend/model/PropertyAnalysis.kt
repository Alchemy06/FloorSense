package com.mango.FloorSenseBackend.model

data class PropertyAnalysis(
    val priceOutlook: String? = null,
    val estimatedAppreciation: String? = null,
    val layoutStrengths: List<String>? = null,
    val layoutWeaknesses: List<String>? = null,
    val marketabilityScore: Int? = null,
    val summary: String? = null
)