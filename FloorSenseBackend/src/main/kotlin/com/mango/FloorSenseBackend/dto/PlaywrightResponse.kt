//package com.mango.FloorSenseBackend.dto
//
//
//import com.mango.FloorSenseBackend.model.FloorPlan
//
//// This class "catches" the raw JSON from your curl/POST request
//data class PlaywrightResponse(
//    val success: Boolean,
//    val data: ScrapedData
//)
//
//// This represents the "data" block in the JSON
//data class ScrapedData(
//    val address: String,
//    val primaryPrice: String,
//    val secondaryPrice: String? = null,
//    val description: String,
//    val keyFeatures: List<String>,
//    val floorplanUrl: String
//) {
//    /**
//
//    Helper to turn the raw scraper data into our MongoDB Entity.
//    We initialize the status as "pending" so our Gemini service
//    knows there is new work to do.*/
//    fun toEntity(): FloorPlan {
//        return FloorPlan(
//            address = this.address,
//            primaryPrice = this.primaryPrice,
//            secondaryPrice = this.secondaryPrice,
//            description = this.description,
//            keyFeatures = this.keyFeatures,
//            floorplanUrl = this.floorplanUrl,
//            status = "pending"
//        // Will be filled by Gemini later
//        )
//    }
//}