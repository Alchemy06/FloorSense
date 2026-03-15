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
    val description: String,
    val keyFeatures: List<String>,
    val floorplanUrl: String
) {
    fun toEntity() = FloorPlan(
        address = address,
        primaryPrice = primaryPrice,
        secondaryPrice = secondaryPrice,
        description = description,
        keyFeatures = keyFeatures,
        floorplanUrl = floorplanUrl,
        status = "pending"
    )
}
