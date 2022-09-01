import split from 'split2'
import { Duplex } from 'stream'
// eslint-disable-next-line quotes
import debugFn = require('debug')

export type Log = {
  level: `info`|`error`,
  message: string,
  timestamp: string,
  context: {
    subscriber_id: string,
    user_id?: string,
    workflow_id?: string
  }
}

export type Options = {
  parse?: (input: string) => Log,
}

const debug = debugFn(`parser:json`)

const defaultParse: Options[`parse`] = (input: string) => JSON.parse(input)

export const jsonStreamParser = (opts: Options={}): Duplex => {
  const parse = (opts.parse ?? defaultParse)
  return split(function(this: Duplex, line: string): string|void {
    debug(line)
    try {
      if (line) {
        return JSON.stringify(parse(line), null, 2)
      }
    } catch (err) {
      this.emit(`error`, new Error(`Could not parse row ${line.slice(0, 50)}...`))
    }
  })
}
