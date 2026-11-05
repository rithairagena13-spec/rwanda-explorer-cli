
import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

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
    if (error.code === 'ENOENT') {
      throw new Error('Places data file was not found.')
    }

    if (error instanceof SyntaxError) {
      throw new Error('Places data contains invalid JSON.')
    }

    throw error
  }
}

export async function savePlaces(places) {
  await writeFile(dataFile, JSON.stringify(places, null, 2))
}