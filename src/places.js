import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const dataFile = path.join(__dirname, 'data', 'places.json')

export async function getPlaces() {
  const data = await readFile(dataFile, 'utf-8')
  return JSON.parse(data)
}

export async function savePlaces(places) {
  await writeFile(dataFile, JSON.stringify(places, null, 2))
}