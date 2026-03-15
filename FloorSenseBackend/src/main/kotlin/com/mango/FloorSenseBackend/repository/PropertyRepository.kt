package com.mango.FloorSenseBackend.repository

import com.mango.FloorSenseBackend.model.PropertyData
import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.stereotype.Repository

@Repository
interface PropertyRepository : MongoRepository<PropertyData, String>