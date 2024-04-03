// Copyright © 2022 Relay Inc.

import { ux } from '@oclif/core'
import { get } from 'lodash-es'

import { Command } from '../lib/command.js'
import * as flags from '../lib/flags/index.js'

import debugFn from 'debug'
const debug = debugFn(`debug`)

export default class Debug extends Command {
  static hidden = true
  static description = `debug Relay CLI configuration`

  static flags = {
    clear: flags.boolean({
      char: `c`,
      default: false,
    }),
    dump: flags.boolean({
      char: `d`,
      default: false,
    }),
    path: flags.string({
      char: `p`,
      dependsOn: [`dump`],
    }),
    [`refresh-auth`]: flags.boolean({
      char: `r`,
      default: false,
    })
  }

  async run(): Promise<void> {
    const { flags } = await this.parse(Debug)

    if (flags.dump) {
      debug(`dump`)
      const session = this.relay.session()
      debug(`session`)
      ux.styledJSON(get(session, flags.path || ``, session))
    }

    if (flags.clear) {
      debug(`clear`)
      this.relay.clear()
      this.log(`Relay CLI configuration cleared`)
    }

    if (flags[`refresh-auth`]) {
      try {
        const tokens = await this.relay.refresh()
        ux.styledHeader(`Auth token refreshed`)
        ux.styledJSON(tokens)
      } catch(e) {
        debug(`failed to refresh token`, e)
        this.error(`Failed to refresh token`)
      }
    }
  }
}
