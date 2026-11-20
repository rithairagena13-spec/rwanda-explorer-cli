# Rwanda Explorer CLI

A command-line application for discovering, searching, and saving interesting places across Rwanda.

## Features

- Explore sample places available in Rwanda.
- Search for places by name or keyword.
- Explore places by category.
- Discover tourist attractions and other places online.
- Display place names, categories, locations, and coordinates.
- Save places for later.
- View your saved places.
- Prevent duplicate saved places.
- Display CLI help and version information.

## Requirements

- Node.js 20 or later
- npm

## Installation

Clone the repository:

```bash
git clone https://github.com/rithairagena13-spec/rwanda-explorer-cli.git
cd rwanda-explorer-cli
```

Install dependencies and link the CLI:

```bash
npm install
npm link
```

## Usage

### Start the interactive application

```bash
rwanda-explorer
```

The application provides the following menu:

1. Explore all places
2. Search for a place
3. Explore by category
4. Discover places online
5. View saved places
6. Save a place
7. Exit

### Available commands

Display available commands:

```bash
rwanda-explorer --help
```

Display the application version:

```bash
rwanda-explorer --version
```

Display sample places:

```bash
rwanda-explorer places
```

Discover places online:

```bash
rwanda-explorer places --online
```

## Development

Run the CLI directly with Node.js:

```bash
node src/index.js
```

Display help during development:

```bash
node src/index.js --help
```

## API

Online places are retrieved from OpenStreetMap data through the Overpass API.

The application uses online data to discover places such as tourist attractions, hotels, natural landmarks, and other points of interest across Rwanda.

## Data Storage

- Local places are stored in `src/data/places.json`.
- Saved places are managed by the application's data-handling functions.

## Author

Ritha and Aliance

## License

ISC