#!/usr/bin/env node 
import { getArguments } from './commands.js'

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
  console.log('Explore interesting places across Rwanda.')
} else {
  console.error('Unknown command. Run --help to see available commands.')
  process.exitCode = 1
}