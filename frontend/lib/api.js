const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

export async function fetchFloorPlans(sortBy = 'recent', page = 1, limit = 6) {
  try {
    const params = new URLSearchParams({
      sortBy,
      page: page.toString(),
      limit: limit.toString(),
    })

    const response = await fetch(`${API_URL}/floorplans?${params}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching floor plans:', error)
    throw error
  }
}

export async function fetchFloorPlanById(id) {
  try {
    const response = await fetch(`${API_URL}/floorplans/${id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching floor plan:', error)
    throw error
  }
}

export async function createFloorPlan(data) {
  try {
    const response = await fetch(`${API_URL}/floorplans`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error creating floor plan:', error)
    throw error
  }
}

export async function uploadFile(file) {
  try {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch(`${API_URL}/upload`, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error uploading file:', error)
    throw error
  }
}

export async function submitRightmoveUrl(url, submittedBy = 'Anonymous') {
  try {
    const response = await fetch(`${API_URL}/submit/from-url`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, submittedBy }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error submitting Rightmove URL:', error)
    throw error
  }
}

export async function submitFloorPlanFile(address, fileUrl, submittedBy = 'Anonymous') {
  try {
    const response = await fetch(`${API_URL}/submit/from-file`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address, fileUrl, submittedBy }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error submitting floor plan:', error)
    throw error
  }
}
