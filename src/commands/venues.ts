// Copyright © 2022 Relay Inc.

import { ux } from '@oclif/core'
import { Command } from '../lib/command.js'
import * as flags from '../lib/flags/index.js'

import debugFn from 'debug'
import { Ok, Result } from 'ts-results-es'
import { Venues } from '../lib/api.js'

const debug = debugFn(`venues`)

export class VenuesCommand extends Command {

  static description = `list all venues`

  static enableJsonFlag = true

  static flags = {
    ...flags.subscriber,
    ...ux.table.flags(),
  }

  async run(): Promise<Result<Venues, Error>> {
    const { flags } = await  this.parse(VenuesCommand)

    const venues = await this.relay.venues(flags[`subscriber-id`])

    debug(venues)

    if (!this.jsonEnabled()) {
      ux.table(venues, {
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
