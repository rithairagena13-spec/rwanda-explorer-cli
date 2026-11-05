# Rwanda Explorer CLI

A command-line tool for discovering interesting places across Rwanda.

## Features

- Explore sample places in Rwanda.
- Fetch live tourist attractions from the Rwanda GeoData API.
- Display place names, categories, and coordinates.
- View CLI help and version information.

## Requirements

- Node.js 20 or later
- npm

## Installation

Clone the repository:

```bash
git clone https://github.com/rithairagena13-spec/rwanda-explorer-cli.git
cd rwanda-explorer-cli
```

Install and link the CLI:

```bash
npm install
npm link
```

## Usage

Display available commands:

```bash
rwanda-explorer --help
```

Display the version:

```bash
rwanda-explorer --version
```

Display sample places:

```bash
rwanda-explorer places
```

Fetch live tourist attractions:

```bash
rwanda-explorer places --online
```

## Development

Run the CLI directly with Node.js:

```bash
node src/index.js --help
```

## API

Live tourist attractions are retrieved from the Rwanda GeoData tourism service.

## Author

Ritha and Aliance

## License

ISC
