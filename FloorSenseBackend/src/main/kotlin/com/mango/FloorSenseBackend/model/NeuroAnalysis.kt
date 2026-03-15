package com.mango.FloorSenseBackend.model

data class NeuroAnalysis(
    val overallScore: String? = null,
    val autismConsiderations: List<String>? = null,
    val adhdConsiderations: List<String>? = null,
    val sensoryRisks: List<String>? = null,
    val positiveFeatures: List<String>? = null,
    val summary: String? = null
)
