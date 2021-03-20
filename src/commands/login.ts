import { Command } from '../lib/command'
import * as flags from '../lib/flags'

export default class Login extends Command {
  static description = `login with your Relay credentials`

  static flags = {
    interactive: flags.boolean({
      char: `i`,
      description: `login with username/password`,
      hidden: true,
    }),
  }

  async run(): Promise<void> {
    const { flags } = this.parse(Login)
    let method: `interactive` | undefined
    if (flags.interactive) method = `interactive`
    await this.relay.login({ method })
  }
}
