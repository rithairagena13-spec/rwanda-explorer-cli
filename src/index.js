#!/usr/bin/env node
import { createInterface } from 'node:readline/promises'
import { getArguments } from './commands.js'
import {
  getPlaces,
  loadSaved,
  saveSaved
} from './places.js'
import { getRwandaPlaces } from './api.js'

const { values, positionals } = getArguments()

function displayPlaces(places, heading = `Found ${places.length} places:`) {
  if (places.length === 0) {
    console.log('\nNo places found.')
    return
  }

function displayPlaces(places) {
  const tableData = places.map((place) => ({
    ID: place.id,
    Name: place.name,
    Category: place.category,
    Location: place.location ?? 'Not available'
  }))

  console.log(`\n${heading}\n`)
  console.table(tableData)
}

function searchPlaces(places, searchTerm) {
  const term = searchTerm.toLowerCase()

  return places.filter((place) => {
    const searchableText = [
      place.name,
      place.category,
      place.location,
      place.lat,
      place.lon
    ].join(' ').toLowerCase()

    return searchableText.includes(term)
  })
}

async function interactiveMenu() {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout
  })

  try {
    let running = true

    while (running) {
      console.log(`

       RWANDA EXPLORER CLI

Discover beautiful places across Rwanda!

What would you like to do?

1. Explore all places
2. Search for a place
3. Explore by category
4. Discover places online
5. View saved places
6. Save a place
7. Exit
`)

      const choice = (await rl.question('Enter your choice (1-7): ')).trim()

      switch (choice) {
        case '1': {
          const places = await getPlaces()
          displayPlaces(places)
          break
        }

        case '2': {
          const searchTerm = (await rl.question('Enter a place name, category or location: ')).trim()

          if (!searchTerm) {
            console.log('Please enter a search term.')
            break
          }

          const places = await getPlaces()
          const results = searchPlaces(places, searchTerm)

          displayPlaces(results, `Search results for "${searchTerm}":`)
          break
        }

        case '3': {
          const places = await getPlaces()

          const categories = [
            ...new Set(places.map((place) => place.category).filter(Boolean))
          ].sort()

          console.log('\nAvailable categories:\n')

          categories.forEach((category, index) => {
            console.log(`${index + 1}. ${category}`)
          })

          const categoryChoice = Number(
            await rl.question('\nChoose a category number: ')
          )

          if (
            !Number.isInteger(categoryChoice) ||
            categoryChoice < 1 ||
            categoryChoice > categories.length
          ) {
            console.log('Invalid category selection.')
            break
          }

          const selectedCategory = categories[categoryChoice - 1]

          const results = places.filter(
            (place) => place.category === selectedCategory
          )

          displayPlaces(results, `Places in ${selectedCategory}:`)
          break
        }

        case '4': {
          console.log('\nDiscovering tourist attractions in Rwanda...\n')

          const places = await getRwandaPlaces()
          displayPlaces(places, 'Online tourist attractions:')
          break
        }

        case '5': {
          const savedPlaces = await loadSaved()
          displayPlaces(savedPlaces, 'Your saved places:')
          break
        }

        case '6': {
          const places = await getPlaces()
          displayPlaces(places)

          const placeId = (await rl.question('\nEnter the ID of the place to save: ')).trim()

          const selectedPlace = places.find(
            (place) => String(place.id) === placeId
          )

          if (!selectedPlace) {
            console.log('Place not found. Please check the ID.')
            break
          }

          const savedPlaces = await loadSaved()

          const alreadySaved = savedPlaces.some(
            (place) => String(place.id) === placeId
          )

          if (alreadySaved) {
            console.log('This place is already saved.')
            break
          }

          savedPlaces.push(selectedPlace)
          await saveSaved(savedPlaces)

          console.log(`${selectedPlace.name} saved successfully!`)
          break
        }

        case '7':
          console.log('\nThank you for exploring Rwanda. Goodbye!')
          running = false
          break

        default:
          console.log('\nInvalid choice. Please select a number from 1 to 7.')
      }

      if (running) {
        await rl.question('\nPress Enter to return to the main menu...')
      }
    }
  } finally {
    rl.close()
  }
}

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
  npm start
  npm start -- places
  npm start -- search Kigali

Commands:
  places       Explore places across Rwanda
  search       Search by name, category or location
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

  if (positionals.length === 0) {
    await interactiveMenu()
    return
  }

  if (positionals[0] === 'places') {
    const places = values.online
      ? await getRwandaPlaces()
      : await getPlaces()

    displayPlaces(places)
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
    const searchTerm = positionals.slice(1).join(' ').trim()

    if (!searchTerm) {
      console.log('Please provide a search term.')
    const query = positionals.slice(1).join(' ').trim().toLowerCase()

    if (!query) {
      console.log('Please provide a search term.')
      console.log('Example: rwanda-explorer search Kigali')
      return
    }

    const places = values.online
      ? await getRwandaPlaces()
      : await getPlaces()

    const results = searchPlaces(places, searchTerm)

    displayPlaces(results, `Search results for "${searchTerm}":`)
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

  console.error('Unknown command. Run "npm start -- --help" for usage.')
  process.exitCode = 1
}

main().catch((error) => {
  console.error(`Error: ${error.message}`)
  process.exitCode = 1
})