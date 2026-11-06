import { readFile, writeFile } from 'node:fs/promises'
import { homedir } from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { CliError } from './ui.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const dataFile = path.join(__dirname, 'data', 'places.json')

export const savedFile = path.join(homedir(), '.rwanda-explorer.json')

export async function getPlaces() {
  const data = await readFile(dataFile, 'utf-8')
  return JSON.parse(data)
}

export async function savePlaces(places) {
  await writeFile(dataFile, JSON.stringify(places, null, 2))
}

export async function loadSaved() {
  try {
    return JSON.parse(await readFile(savedFile, 'utf-8'))
  } catch (error) {
    if (error.code === 'ENOENT') return []
    throw new CliError(`Could not read ${savedFile}: ${error.message}`, 1)
  }
}

export async function saveSaved(places) {
  await writeFile(savedFile, JSON.stringify(places, null, 2))
}