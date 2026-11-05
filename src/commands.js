import { parseArgs } from 'node:util'

export function getArguments() {
  const { values, positionals } = parseArgs({
    options: {
      help: {
        type: 'boolean',
        short: 'h'
      },
      version: {
        type: 'boolean',
        short: 'v'
      },
      online: {
        type: 'boolean'
      }
    },
    allowPositionals: true
  })

  return { values, positionals }
}