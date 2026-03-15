package com.mango.FloorSenseBackend.model

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document
import java.time.Instant

@Document(collection = "properties")
data class PropertyData(
    @Id
    val id: String? = null,
    val rightmoveUrl: String,
    val address: String? = null,
    val primaryPrice: String? = null,
    val secondaryPrice: String? = null,
    val keyFeatures: List<String>? = null,
    val description: String? = null,
    val floorplanUrl: String? = null,
    val analyzedAt: Instant? = null,
    var status: String = "pending",
    var tacticalAnalysis: TacticalAnalysis? = null,
    var neuroAnalysis: NeuroAnalysis? = null,
    var propertyAnalysis: PropertyAnalysis? = null
)

data class ScraperRequest(val url: String)
data class ScraperResponse(val success: Boolean, val data: PropertyData?, val error: String?)