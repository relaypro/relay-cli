// Copyright © 2022 Relay Inc.

import { Command } from '../lib/command'

// const debug = require(`debug`)(`reset`)

export default class Reset extends Command {
  static hidden = true
  static description = `reset Relay CLI configuration`

  async run(): Promise<void> {
    // this.relay.reset()
    this.log(`Relay CLI configuration cleared`)
  }
}
