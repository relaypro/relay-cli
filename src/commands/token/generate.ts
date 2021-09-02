import { cli } from 'cli-ux'
import { Command } from '../../lib/command'
import { vars } from '../../lib/vars'

export default class Login extends Command {
  static description = `generate a token that can be used with the Relay SDK`

  async run(): Promise<void> {
    const token = await this.relay.generateToken()
    cli.styledHeader(`SDK TOKEN`)
    cli.log(`The following token can be used in the configured environment`)
    cli.styledObject({
      env: vars.env,
      api: vars.host,
      token,
    })
  }
}
