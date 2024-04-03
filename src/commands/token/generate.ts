// Copyright © 2022 Relay Inc.

import { ux } from '@oclif/core'
import { Command } from '../../lib/command.js'
import { vars } from '../../lib/vars.js'

import * as flags from '../../lib/flags/index.js'

export default class GenerateToken extends Command {
  static description = `generate a token that can be used with the Relay SDK`

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

    ux.styledHeader(`SDK TOKEN`)
    ux.log(`The following token can be used in the configured environment`)
    ux.styledObject({
      env: vars.rawEnv,
      api: vars.host,
      token,
    })
  }
}
