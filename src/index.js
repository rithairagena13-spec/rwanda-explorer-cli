#!/usr/bin/env node

import { getArguments } from './commands.js'
import { getPlaces } from './places.js'
import { getRwandaPlaces } from './api.js'

const { values, positionals } = getArguments()

async function main() {
  if (values.version) {
    console.log('Rwanda Explorer CLI v1.0.0')
    return
  }

  if (values.help) {
    console.log(`
Rwanda Explorer CLI

Usage:
  rwanda-explorer <command> [options]

Commands:
  places       Explore places across Rwanda

Options:
  --online     Fetch live Rwanda attractions
  -h, --help   Show help
  -v, --version Show version
`)
    return
  }

  if (positionals[0] === 'places') {
    if (values.online) {
      console.log('\nDiscovering tourist attractions in Rwanda...\n')

      const places = await getRwandaPlaces()

      if (places.length === 0) {
        console.log('No tourist attractions were found.')
        return
      }

      console.log(`Found ${places.length} places:\n`)

      places.forEach((place, index) => {
        console.log(`
${index + 1}. ${place.name}
   Category: ${place.category}
   Coordinates: ${place.lat}, ${place.lon}
`)
      })

      return
    }

    const places = await getPlaces()

    places.forEach((place) => {
      console.log(`
${place.id}. ${place.name}
   Location: ${place.location}
   Category: ${place.category}
   Description: ${place.description}
`)
    })

    return
  }

  console.error('Unknown command. Run --help to see available commands.')
  process.exitCode = 1
}

main().catch((error) => {
  console.error(`Error: ${error.message}`)
  process.exitCode = 1
})
