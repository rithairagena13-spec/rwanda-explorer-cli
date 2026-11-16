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
    let places

    if (values.online) {
      console.log('\nDiscovering tourist attractions in Rwanda...\n')
      places = await getRwandaPlaces()
    } else {
      places = await getPlaces()
    }

    if (places.length === 0) {
      console.log('No places found.')
      return
    }

    const tableData = places.map((place) => ({
      ID: place.id,
      Name: place.name,
      Category: place.category,
      Location: place.location ?? 'Not available'
    }))

    console.log(`Found ${places.length} places:\n`)
    console.table(tableData)

    return
  }

  console.error('Unknown command. Run --help to see available commands.')
  process.exitCode = 1
}

main().catch((error) => {
  console.error(`Error: ${error.message}`)
  process.exitCode = 1
})

