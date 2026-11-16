#!/usr/bin/env node

import { getArguments } from './commands.js'
import { getPlaces } from './places.js'
import { getRwandaPlaces } from './api.js'

const VERSION = 'Rwanda Explorer CLI v1.0.0'

const HELP_TEXT = `
Rwanda Explorer CLI

Usage:
  rwanda-explorer <command> [options]

Commands:
  places       Explore places across Rwanda

Options:
  --online     Fetch live Rwanda attractions
  -h, --help   Show help
  -v, --version Show version
`

function showPlaces(places, emptyMessage) {
  if (places.length === 0) {
    console.log(emptyMessage)
    return
  }

  console.log(`Found ${places.length} places:\n`)
  console.table(places)
}

async function runPlacesCommand(isOnline) {
  if (isOnline) {
    console.log('\nDiscovering tourist attractions in Rwanda...\n')
    const places = await getRwandaPlaces()
    showPlaces(places, 'No tourist attractions were found.')
    return
  }

  const places = await getPlaces()
  showPlaces(places, 'No places found.')
}

async function main() {
  const { values, positionals } = getArguments()

  if (values.version) {
    console.log(VERSION)
    return
  }

  if (values.help) {
    console.log(HELP_TEXT)
    return
  }

  if (positionals[0] === 'places') {
    await runPlacesCommand(values.online)
    return
  }

  console.error('Unknown command. Run --help to see available commands.')
  process.exitCode = 1
}

main().catch((error) => {
  console.error(`Error: ${error.message}`)
  process.exitCode = 1
})