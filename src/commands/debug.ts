import { Command } from '../lib/command'
// eslint-disable-next-line quotes
import debugFn = require('debug')

import * as flags from '../lib/flags'
import { cli } from 'cli-ux'
import { get } from 'lodash'

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
    const { flags } = this.parse(Debug)

    if (flags.dump) {
      debug(`dump`)
      const session = this.relay.session()
      debug(`session`)
      cli.styledJSON(get(session, flags.path || ``, session))
    }

    if (flags.clear) {
      debug(`clear`)
      this.relay.clear()
      this.log(`Relay CLI configuration cleared`)
    }

    if (flags[`refresh-auth`]) {
      try {
        const tokens = await this.relay.refresh()
        cli.styledHeader(`Auth token refreshed`)
        cli.styledJSON(tokens)
      } catch(e) {
        debug(`failed to refresh token`, e)
        cli.error(`Failed to refresh token`)
      }
    }
  }
}
