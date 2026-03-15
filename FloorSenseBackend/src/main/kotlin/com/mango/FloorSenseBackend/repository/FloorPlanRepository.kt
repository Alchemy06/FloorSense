package com.mango.FloorSenseBackend.repository

import com.mango.FloorSenseBackend.model.FloorPlan
import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.stereotype.Repository

@Repository
interface FloorPlanRepository : MongoRepository<FloorPlan, String> {

    // Spring Boot automatically writes the database query for this behind the scenes!
    // It will find all documents where status == "pending"
    fun findByStatus(status: String): List<FloorPlan>
}
