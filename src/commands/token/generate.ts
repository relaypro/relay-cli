// Copyright © 2022 Relay Inc.

import { CliUx } from '@oclif/core'
import { Command } from '../../lib/command'
import { vars } from '../../lib/vars'

export default class Login extends Command {
  static description = `generate a token that can be used with the Relay SDK`

  async run(): Promise<void> {
    const token = await this.relay.generateToken()
    CliUx.ux.styledHeader(`SDK TOKEN`)
    CliUx.ux.log(`The following token can be used in the configured environment`)
    CliUx.ux.styledObject({
      env: vars.env,
      api: vars.host,
      token,
    })
  }
}
