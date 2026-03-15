package com.mango.FloorSenseBackend.model

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document

@Document(collection = "floorplans")
data class FloorPlan(
    @Id
    val id: String? = null,
    val floorplanUrl: String,
    val address: String? = null,
    val sourceUrl: String? = null,
    var status: String = "pending",
    var tacticalAnalysis: TacticalAnalysis? = null
)