
import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { CliError } from './ui.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const dataFile = path.join(__dirname, 'data', 'places.json')

export async function getPlaces() {
  try {
    const data = await readFile(dataFile, 'utf-8')
    const places = JSON.parse(data)

    if (!Array.isArray(places)) {
      throw new Error('Places data must be an array.')
    }

    return places
  } catch (error) {
    throw new CliError(`Could not read places: ${error.message}`, 1)
  }
}

export async function savePlaces(places) {
  await writeFile(dataFile, JSON.stringify(places, null, 2))
}

export async function loadSaved() {
  const places = await getPlaces()
  return places.filter((place) => place.saved === true)
}

export async function saveSaved(savedPlaces) {
  const places = await getPlaces()

  const savedIds = new Set(
    savedPlaces.map((place) => String(place.id))
  )

  const updatedPlaces = places
    .filter((place) => !place.saved || savedIds.has(String(place.id)))
    .map((place) => ({
      ...place,
      saved: savedIds.has(String(place.id))
    }))

  for (const place of savedPlaces) {
    const exists = updatedPlaces.some(
      (existing) => String(existing.id) === String(place.id)
    )

    if (!exists) {
      updatedPlaces.push({
        ...place,
        saved: true
      })
    }
  }

  await savePlaces(updatedPlaces)
}

