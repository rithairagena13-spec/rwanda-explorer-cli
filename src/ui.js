const useColor = process.stdout.isTTY && !process.env.NO_COLOR
const wrap = (code) => (s) => (useColor ? `\x1b[${code}m${s}\x1b[0m` : String(s))

export const c = {
  red: wrap(31),
  green: wrap(32),
  yellow: wrap(33),
  cyan: wrap(36),
  bold: wrap(1),
  dim: wrap(2)
}

export class CliError extends Error {
  constructor(message, code = 1) {
    super(message)
    this.code = code
  }
}

export function table(rows, columns) {
  const widths = columns.map((col) =>
    Math.max(col.label.length, ...rows.map((r) => String(r[col.key] ?? '').length))
  )
  const pad = (text, i) => String(text).padEnd(widths[i])

  console.log(c.bold(columns.map((col, i) => pad(col.label, i)).join('  ')))
  console.log(c.dim(widths.map((w) => '-'.repeat(w)).join('  ')))
  for (const row of rows) {
    console.log(columns.map((col, i) => pad(row[col.key] ?? '', i)).join('  '))
  }
}

export async function withSpinner(text, fn) {
  if (!process.stderr.isTTY) return fn()
  const frames = ['|', '/', '-', '\\']
  let i = 0
  const timer = setInterval(() => {
    process.stderr.write(`\r${frames[i++ % frames.length]} ${text}`)
  }, 100)
  try {
    return await fn()
  } finally {
    clearInterval(timer)
    process.stderr.write('\r\x1b[K')
  }
}