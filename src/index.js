#!/usr/bin/env node
import { getArguments } from './commands.js'
import { getPlaces, loadSaved, saveSaved, savedFile } from './places.js'
import { getRwandaPlaces } from './api.js'
import { c, table, withSpinner, CliError } from './ui.js'

const HELP = `
${c.bold('Rwanda Explorer CLI')}

${c.bold('Usage:')}
  rwanda-explorer <command> [options]

${c.bold('Commands:')}
  places         Explore places across Rwanda
  saved          Show places you saved earlier

${c.bold('Options:')}
  --online         Fetch live Rwanda attractions (used with "places")
  --save           Save the fetched places to a file (used with --online)
  -n, --limit <n>  How many online places to show (default 10)
  -h, --help       Show help
  -v, --version    Show version

${c.bold('Examples:')}
  rwanda-explorer places
  rwanda-explorer places --online --limit 5
  rwanda-explorer places --online --save
  rwanda-explorer saved

Saved places are stored in: ${savedFile}
`

function formatCoord(n) {
  return typeof n === 'number' ? n.toFixed(4) : '-'
}

function showPlacesTable(places) {
  table(
    places.map((p, i) => ({
      n: i + 1,
      name: p.name,
      category: p.category,
      lat: formatCoord(p.lat),
      lon: formatCoord(p.lon)
    })),
    [
      { key: 'n', label: '#' },
      { key: 'name', label: 'NAME' },
      { key: 'category', label: 'CATEGORY' },
      { key: 'lat', label: 'LAT' },
      { key: 'lon', label: 'LON' }
    ]
  )
}

async function main() {
  const { values, positionals } = getArguments()
  const [command] = positionals

  if (values.version) {
    console.log('Rwanda Explorer CLI v1.0.0')
    return
  }

  if (values.help || !command) {
    console.log(HELP)
    return
  }

  if (command === 'places') {
    if (values.online) {
      const limit = Number(values.limit)
      if (!Number.isInteger(limit) || limit < 1) {
        throw new CliError('--limit must be a whole number, 1 or higher.', 1)
      }

      const places = await withSpinner('Discovering tourist attractions...', getRwandaPlaces)

      if (places.length === 0) {
        console.log(c.yellow('No tourist attractions were found.'))
        return
      }

      const shown = places.slice(0, limit)
      console.log(c.green(`Showing ${shown.length} of ${places.length} places:\n`))
      showPlacesTable(shown)

      if (values.save) {
        await saveSaved(shown)
        console.log(c.green(`\nSaved ${shown.length} places to ${savedFile}`))
      }
      return
    }

    const places = await getPlaces()
    for (const place of places) {
      console.log(`
${c.cyan(place.id + '.')} ${c.bold(place.name)}
   Location: ${place.location}
   Category: ${place.category}
   Description: ${place.description}`)
    }
    console.log()
    return
  }

  if (command === 'saved') {
    const places = await loadSaved()
    if (places.length === 0) {
      console.log(c.yellow('Nothing saved yet. Try: rwanda-explorer places --online --save'))
      return
    }
    showPlacesTable(places)
    return
  }

  throw new CliError(`Unknown command "${command}". Run "rwanda-explorer --help" for usage.`, 1)
}

main().catch((error) => {
  console.error(c.red('Error: ') + error.message)
  process.exitCode = error instanceof CliError ? error.code : 1
})
