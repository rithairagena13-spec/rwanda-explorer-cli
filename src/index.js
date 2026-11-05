#!/usr/bin/env node

import { getArguments } from './commands.js'
import { getPlaces } from './places.js'

const { values, positionals } = getArguments()

if (values.version) {
  console.log('Rwanda Explorer CLI v1.0.0')
} else if (values.help) {
  console.log(`
Rwanda Explorer CLI

Usage:
  rwanda-explorer <command> [options]

Commands:
  places       Explore places across Rwanda

Options:
  -h, --help       Show help
  -v, --version    Show version
`)
} else if (positionals[0] === 'places') {
  const places = await getPlaces()

  places.forEach((place) => {
    console.log(`
${place.id}. ${place.name}
   Location: ${place.location}
   Category: ${place.category}
   Description: ${place.description}
`)
  })
} else {
  console.error('Unknown command. Run --help to see available commands.')
  process.exitCode = 1
}