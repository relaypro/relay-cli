import { Command } from '../lib/command'

export default class Logout extends Command {
  static description = 'logout and forget any tokens'

  async run() {
    await this.relay.logout()
    this.log(`Logged out`)
  }
}
