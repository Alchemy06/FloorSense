package com.mango.FloorSenseBackend.dto

import com.mango.FloorSenseBackend.model.FloorPlan

data class PlaywrightResponse(
    val success: Boolean,
    val data: ScrapedData
)

data class ScrapedData(
    val address: String,
    val primaryPrice: String,
    val secondaryPrice: String? = null,
    val description: String? = null,
    val keyFeatures: List<String> = emptyList(),
    val floorplanUrl: String
) {
    fun toEntity(submittedBy: String = "Anonymous") = FloorPlan(
        address = address,
        primaryPrice = primaryPrice,
        secondaryPrice = secondaryPrice,
        description = description,
        keyFeatures = keyFeatures,
        floorplanUrl = floorplanUrl,
        status = "pending",
        submittedBy = submittedBy
    )
}