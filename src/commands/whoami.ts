import { cli } from 'cli-ux'
import { Command } from '../lib/command'

export default class AuthWhoami extends Command {
  static description = 'display the current logged in user'

  static aliases = ['whoami']

  async run() {
    if (process.env.RELAY_API_KEY) this.warn('RELAY_API_KEY is set')
    if (!this.relay.auth) this.notloggedin()
    try {
      const iam = await this.relay.whoami()
      cli.styledHeader(`You are`)
      cli.styledObject(iam, [`email`, `given_name`, `family_name`, `userid`, `service_line_id`])
    } catch (error) {
      if (error.statusCode === 401) this.notloggedin()
      throw error
    }
  }

  notloggedin() {
    this.error('not logged in', {exit: 100})
  }
}
