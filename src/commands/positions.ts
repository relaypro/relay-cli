// Copyright © 2022 Relay Inc.

import { ux } from '@oclif/core'
import { Command } from '../lib/command.js'
import * as flags from '../lib/flags/index.js'

import debugFn from 'debug'
import { Positions } from '../lib/api.js'
import { Ok, Result } from 'ts-results-es'
import { filter, isEmpty, join, last, toLower } from 'lodash-es'

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
    [`placeholders`]: flags.boolean({
      char: `p`,
      description: `Show floor placeholders`,
      default: false,
      allowNo: true,
      hidden: true,
    }),
    ...ux.table.flags(),
  }

  async run(): Promise<Result<Positions, Error>> {
    const { flags } = await  this.parse(PositionsCommand)
    const subscriberId = flags[`subscriber-id`]
    const venueId = flags[`venue-id`]
    const allowPlaceholders = flags[`placeholders`]

    let positions = await this.relay.venuePositions(subscriberId, venueId)

    debug(positions)
    debug(`allowPlaceholders`, allowPlaceholders)

    if (!allowPlaceholders) {
      positions = filter(positions, positions => toLower(last(positions.tags)) !== `placeholder12345`)
    }

    if (!this.jsonEnabled()) {
      ux.table(positions, {
        position_id: {
          header: `ID`
        },
        tags: {
          header: `Name`,
          get: position => {
            if (isEmpty(position.tags)) {
              return `Unknown`
            } else {
              return join(position.tags, ` > `)
            }
          }
        },
      }, {
        ...flags,
        sort: `Name`,
      })
    }

    return Ok(positions)
  }
}
