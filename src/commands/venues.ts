// Copyright © 2022 Relay Inc.

import { CliUx } from '@oclif/core'
import { Command } from '../lib/command'
import * as flags from '../lib/flags'

// eslint-disable-next-line quotes
import debugFn = require('debug')
import { Ok, Result } from 'ts-results'
import { Venues } from '../lib/api'

const debug = debugFn(`venues`)

export class VenuesCommand extends Command {

  static description = `list all venues`

  static enableJsonFlag = true

  static flags = {
    ...flags.subscriber,
    ...CliUx.ux.table.flags(),
  }

  async run(): Promise<Result<Venues, Error>> {
    const { flags } = await  this.parse(VenuesCommand)

    const venues = await this.relay.venues(flags[`subscriber-id`])

    debug(venues)

    if (!this.jsonEnabled()) {
      CliUx.ux.table(venues, {
        venue_id: {
          header: `ID`
        },
        venue_name: {
          header: `Name`
        },
      }, {
        ...flags,
        sort: `Name`,
      })
    }

    return Ok(venues)

  }
}
