import { Command } from '../lib/command'
// eslint-disable-next-line quotes
// import debugFn = require('debug')

// import * as flags from '../lib/flags'
// import { cli } from 'cli-ux'
// import { get } from 'lodash'

// const debug = debugFn(`broadcast`)

export default class Broadcast extends Command {
  static hidden = true
  static description = `send a broadcast to one or more Relays`

  async run(): Promise<void> {
    // const { flags } = this.parse(Broadcast)
  }
}
