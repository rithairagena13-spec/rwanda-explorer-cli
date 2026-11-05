#!/usr/bin/env node 
import { getArguments } from './commands.js'

const { values, positionals } = getArguments()

console.log(values, positionals);