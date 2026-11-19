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

function displayPlaces(
  places,
  heading = `Found ${places.length} places:`,
  limit = Infinity
) {
  if (places.length === 0) {
    console.log('\nNo places found.')
    return
  }

  const displayedPlaces = places.slice(0, limit)

  const tableData = displayedPlaces.map((place) => ({
    ID: place.id,
    Name: place.name,
    Category: place.category,
    Location: place.location ??
      (place.lat != null && place.lon != null
        ? `${Number(place.lat).toFixed(4)}, ${Number(place.lon).toFixed(4)}`
        : 'Not available')
  }))

  console.log(`\n${heading}\n`)
  console.table(tableData)

  if (places.length > limit) {
    console.log(`Showing ${limit} of ${places.length} places.`)
  }
}

function displayOnlinePlaces(
  places,
  heading = 'ONLINE SEARCH RESULTS'
) {
  if (places.length === 0) {
    console.log('\nNo online places found.')
    return
  }

  console.log(`\n${heading}\n`)

 
  
places.forEach((place, index) => {
  const location = place.location ??
    (place.lat != null && place.lon != null
      ? `${Number(place.lat).toFixed(4)}, ${Number(place.lon).toFixed(4)}`
      : 'Not available')

  console.log(`${index + 1}. ${place.name}`)
  console.log(`   ID: ${place.id}`)
  console.log(`   Category: ${place.category || 'Other'}`)
  console.log(`   Location: ${location}`)
  console.log('')
})


  console.log(`${places.length} online places found.`)
}

function searchPlaces(places, searchTerm) {
  const term = searchTerm.trim().toLowerCase()

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

async function saveSelectedPlace(rl, places, online = false) {
  if (places.length === 0) {
    console.log('\nNo places available to save.')
    return
  }

  if (online) {
    displayOnlinePlaces(places, 'ONLINE PLACES AVAILABLE TO SAVE')
  } else {
    displayPlaces(places, 'AVAILABLE LOCAL PLACES:')
  }

  const placeId = (
    await rl.question('\nEnter the ID of the place to save: ')
  ).trim()

  const selectedPlace = places.find(
    (place) => String(place.id) === placeId
  )

  if (!selectedPlace) {
    console.log('Place not found. Please check the ID.')
    return
  }

  const savedPlaces = await loadSaved()

  const placeToSave = online
    ? {
        ...selectedPlace,
        id: `online-${selectedPlace.id}`,
        source: 'online'
      }
    : selectedPlace

  const alreadySaved = savedPlaces.some(
    (place) => String(place.id) === String(placeToSave.id)
  )

  if (alreadySaved) {
    console.log('This place is already saved.')
    return
  }

  savedPlaces.push(placeToSave)
  await saveSaved(savedPlaces)

  console.log(`\n${selectedPlace.name} saved successfully!`)
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

1. Explore some places
2. Search for a place
3. Explore by category
4. Discover places online
5. View saved places
6. Save a place
7. Exit
`)

      const choice = (
        await rl.question('Enter your choice (1-7): ')
      ).trim()

      switch (choice) {
        case '1': {
          const places = await getPlaces()
          displayPlaces(places)
          break
        }

        case '2': {
          const searchTerm = (
            await rl.question('Enter a place name, category or location: ')
          ).trim()

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
          console.log(`
Discover Places Online

1. Search for a specific place
2. Explore all online places
3. Return to main menu
`)

          const onlineChoice = (
            await rl.question('Enter your choice (1-3): ')
          ).trim()

          if (onlineChoice === '1') {
            const searchTerm = (
              await rl.question('\nEnter a place name, category or location: ')
            ).trim()

            if (!searchTerm) {
              console.log('Please enter a search term.')
              break
            }

            console.log('\nSearching online...\n')

            const onlinePlaces = await getRwandaPlaces()
            const places = searchPlaces(onlinePlaces, searchTerm)

            displayOnlinePlaces(
              places.slice(0, 20),
              `ONLINE SEARCH RESULTS FOR "${searchTerm}"`
            )
          } else if (onlineChoice === '2') {
            console.log('\nDiscovering places online...\n')

            const places = await getRwandaPlaces()

            displayOnlinePlaces(
              places.slice(0, 20),
              'ALL ONLINE TOURIST ATTRACTIONS'
            )

            if (places.length > 20) {
              console.log(`Showing 20 of ${places.length} places.`)
            }
          } else if (onlineChoice === '3') {
            console.log('\nReturning to main menu...')
          } else {
            console.log('\nInvalid choice. Please select 1, 2 or 3.')
          }

          break
        }

        case '5': {
          const savedPlaces = await loadSaved()
          displayPlaces(savedPlaces, 'Your saved places:')
          break
        }

        case '6': {
          console.log(`
Save a Place

1. Save a local place
2. Search and save an online place
3. Return to main menu
`)

          const saveChoice = (
            await rl.question('Enter your choice (1-3): ')
          ).trim()

          if (saveChoice === '1') {
            const places = await getPlaces()
            await saveSelectedPlace(rl, places)
          } else if (saveChoice === '2') {
            const searchTerm = (
              await rl.question('\nEnter the online place to search for: ')
            ).trim()

            if (!searchTerm) {
              console.log('Please enter a search term.')
              break
            }

            console.log('\nSearching online...\n')

            const onlinePlaces = await getRwandaPlaces()
            const places = searchPlaces(onlinePlaces, searchTerm)

            if (places.length === 0) {
              console.log('\nNo matching online places found.')
              break
            }

            await saveSelectedPlace(rl, places, true)
          } else if (saveChoice === '3') {
            console.log('\nReturning to main menu...')
          } else {
            console.log('Invalid choice. Please select 1, 2 or 3.')
          }

          break
        }

        case '7': {
          console.log('\nThank you for exploring Rwanda. Goodbye!')
          running = false
          break
        }

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

Options:
  --online      Fetch live Rwanda attractions
  -h, --help    Show help
  -v, --version Show version

Examples:
  npm start -- places
  npm start -- places --online
  npm start -- search Kigali
  npm start -- search Nature
  npm start -- search "Lake Kivu"
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
    return
  }

  if (positionals[0] === 'search') {
    const searchTerm = positionals.slice(1).join(' ').trim()

    if (!searchTerm) {
      console.log('Please provide a search term.')
      return
    }

    const places = values.online
      ? await getRwandaPlaces()
      : await getPlaces()

    const results = searchPlaces(places, searchTerm)

    displayPlaces(results, `Search results for "${searchTerm}":`)
    return
  }

  console.error('Unknown command. Run "npm start -- --help" for usage.')
  process.exitCode = 1
}

main().catch((error) => {
  console.error(`Error: ${error.message}`)
  process.exitCode = 1
})
