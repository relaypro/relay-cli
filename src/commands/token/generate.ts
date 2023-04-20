// Copyright © 2022 Relay Inc.

import { CliUx } from '@oclif/core'
import { Command } from '../../lib/command'
import { vars } from '../../lib/vars'

import * as flags from '../../lib/flags'

export default class GenerateToken extends Command {
  static description = `generate a token that can be used with the Relay SDK`

  static flags = {
    [`legacy-auth`]: flags.boolean({
      char: `l`,
      env: `RELAY_LEGACY_AUTH`,
      hidden: true,
    }),
  }

  async run(): Promise<void> {
    const { flags } = await this.parse(GenerateToken)

    // reverse syncing environment as vars depend on only env
    process.env.RELAY_LEGACY_AUTH = `${flags[`legacy-auth`]}`

    const token = await this.relay.generateToken()

    CliUx.ux.styledHeader(`SDK TOKEN`)
    CliUx.ux.log(`The following token can be used in the configured environment`)
    CliUx.ux.styledObject({
      env: vars.rawEnv,
      api: vars.host,
      token,
    })
  }
}
