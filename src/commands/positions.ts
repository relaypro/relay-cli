// Copyright © 2022 Relay Inc.

import { CliUx } from '@oclif/core'
import { Command } from '../lib/command'
import * as flags from '../lib/flags'

// eslint-disable-next-line quotes
import debugFn = require('debug')
import { Positions } from '../lib/api'
import { Ok, Result } from 'ts-results'
import { isEmpty, join } from 'lodash'

const debug = debugFn(`positions`)

export class PositionsCommand extends Command {

  static description = `list all positions by venue`

  static enableJsonFlag = true

  static flags = {
    ...flags.subscriber,
    [`venue-id`]: flags.string({
      char: `v`,
      description: `venue id`,
      required: true,
      hidden: false,
      multiple: false,
    }),
    ...CliUx.ux.table.flags(),
  }

  async run(): Promise<Result<Positions, Error>> {
    const { flags } = await  this.parse(PositionsCommand)

    const venues = await this.relay.venuePositions(flags[`subscriber-id`], flags[`venue-id`])

    debug(venues)

    if (!this.jsonEnabled()) {
      CliUx.ux.table(venues, {
        position_id: {
          header: `ID`
        },
        tags: {
          header: `Name`,
          get: venue => {
            if (isEmpty(venue.tags)) {
              return `Unknown`
            } else {
              return join(venue.tags, ` > `)
            }
          }
        },
      }, {
        ...flags,
        sort: `Name`,
      })
    }

    return Ok(venues)
  }
}
