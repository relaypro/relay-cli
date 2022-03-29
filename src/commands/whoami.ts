import { CliUx } from '@oclif/core'
import { HTTPError } from 'http-call'
import { Command } from '../lib/command'

export default class AuthWhoami extends Command {
  static description = `display the current logged in user`

  async run(): Promise<void> {
    if (process.env.RELAY_API_KEY) this.warn(`RELAY_API_KEY is set`)
    if (!this.relay.auth) this.notloggedin()
    try {
      const iam = await this.relay.whoami()
      CliUx.ux.styledHeader(`You are`)
      CliUx.ux.styledObject(iam, [`Name`, `Email`, `Auth User ID`, `Relay User ID`, `Default Subscriber`])
    } catch (error) {
      if (error instanceof HTTPError) {
        if (error.statusCode === 401) this.notloggedin()
      }
      throw error
    }
  }

  notloggedin(): void {
    this.error(`not logged in`, { exit: 100 })
  }
}
