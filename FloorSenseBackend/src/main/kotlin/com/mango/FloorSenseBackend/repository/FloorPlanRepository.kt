package com.mango.FloorSenseBackend.repository

import com.mango.FloorSenseBackend.model.FloorPlan
import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.stereotype.Repository

@Repository
interface FloorPlanRepository : MongoRepository<FloorPlan, String> {
    fun findByStatus(status: String): List<FloorPlan>
}
