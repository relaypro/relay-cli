// Copyright © 2022 Relay Inc.

import { Command } from '../lib/command'

export default class Logout extends Command {
  static description = `logout and forget any tokens`

  async run(): Promise<void> {
    await this.relay.logout()
    this.log(`Logged out`)
  }
}
