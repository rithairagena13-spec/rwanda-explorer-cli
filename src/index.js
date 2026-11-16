import { getArguments } from './commands.js'
import { getPlaces } from './places.js'
import { getRwandaPlaces } from './api.js'

const { values, positionals } = getArguments()

function displayPlaces(places) {
  const tableData = places.map((place) => ({
    ID: place.id,
    Name: place.name,
    Category: place.category,
    Location: place.location ??
      (place.lat != null && place.lon != null
        ? `${place.lat}, ${place.lon}`
        : 'Not available')
  }))

  console.table(tableData)
}

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
  search       Search for places by name, location or category

Options:
  --online     Fetch live Rwanda attractions
  -h, --help   Show help
  -v, --version Show version

Examples:
  rwanda-explorer places
  rwanda-explorer places --online
  rwanda-explorer search Kigali
  rwanda-explorer search Nature
  rwanda-explorer search "Lake Kivu"
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

    console.log(`Found ${places.length} places:\n`)
    displayPlaces(places)

    return
  }

  if (positionals[0] === 'search') {
    const query = positionals.slice(1).join(' ').trim().toLowerCase()

    if (!query) {
      console.log('Please provide a search term.')
      console.log('Example: rwanda-explorer search Kigali')
      return
    }

    const places = values.online
      ? await getRwandaPlaces()
      : await getPlaces()

    const results = places.filter((place) => {
      const searchableText = [
        place.name,
        place.category,
        place.location,
        place.lat,
        place.lon
      ].join(' ').toLowerCase()

      return searchableText.includes(query)
    })

    if (results.length === 0) {
      console.log(`No places found matching "${query}".`)
      return
    }

    console.log(`\nFound ${results.length} places matching "${query}":\n`)
    displayPlaces(results)

    return
  }

  console.error('Unknown command. Run --help to see available commands.')
  process.exitCode = 1
}

main().catch((error) => {
  console.error(`Error: ${error.message}`)
  process.exitCode = 1
})