

const API_URL =
  'https://geodata.rw/server/rest/services/basemap/Tourism_POI/MapServer/0/query'

export async function getRwandaPlaces() {
  try {
    const params = new URLSearchParams({
      where: '1=1',
      outFields: 'name,type,source',
      returnGeometry: 'true',
      outSR: '4326',
      f: 'json'
    })

    const response = await fetch(`${API_URL}?${params}`, {
      signal: AbortSignal.timeout(15000)
    })

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`)
    }

    const data = await response.json()

    if (data.error) {
      throw new Error(data.error.message || 'API request failed.')
    }

    if (!Array.isArray(data.features)) {
      throw new Error('Invalid API response.')
    }

    return data.features
      .filter((place) => place.attributes?.name)
      .map((place, index) => ({
        id: place.attributes.OBJECTID ?? place.attributes.objectid ?? index + 1,
        name: place.attributes.name,
        category: place.attributes.type || 'Tourist attraction',
        lat: place.geometry?.y ?? null,
        lon: place.geometry?.x ?? null
      }))
  } catch (error) {
    if (error.name === 'TimeoutError') {
      throw new Error('The request timed out. Please try again.')
    }

    if (error instanceof TypeError) {
      throw new Error('Network error. Check your internet connection.')
    }

    throw error
  }
}
