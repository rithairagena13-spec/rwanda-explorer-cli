import { parseArgs } from 'node:util'
import { CliError } from './ui.js'

export function getArguments() {
  try {
    return parseArgs({
      options: {
        help: { type: 'boolean', short: 'h' },
        version: { type: 'boolean', short: 'v' },
        online: { type: 'boolean' },
        save: { type: 'boolean' },
        limit: { type: 'string', short: 'n', default: '10' }
      },
      allowPositionals: true
    })
  } catch (error) {
    throw new CliError(`${error.message}\nRun "rwanda-explorer --help" for usage.`, 1)
  }
}