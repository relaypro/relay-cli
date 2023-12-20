// Copyright © 2022 Relay Inc.

import { CliUx } from '@oclif/core'
import { Command } from '../../lib/command'
import { vars } from '../../lib/vars'

import * as flags from '../../lib/flags'

export default class GenerateToken extends Command {
  static description = `Generate a token that can be used with the Relay SDK`

  static flags = {
    [`jwt`]: flags.boolean({
      char: `l`,
      hidden: true,
      default: false,
    }),
  }

  async run(): Promise<void> {
    const { flags } = await this.parse(GenerateToken)

    // reverse syncing environment as vars depend on only env
    if (process.env.RELAY_LEGACY_AUTH === undefined) {
      process.env.RELAY_LEGACY_AUTH = `${!flags[`jwt`]}`
    }

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
