// Copyright © 2022 Relay Inc.

import { CliUx } from '@oclif/core'
import { Command } from '../../lib/command'
import * as flags from '../../lib/flags'

// eslint-disable-next-line quotes
import debugFn = require('debug')
import { ProfileAuditEventResults } from '../../lib/api'
import { Ok, Result } from 'ts-results'
import { isEmpty } from 'lodash'
import { getFormattedTimestamp } from '../../lib/datetime'

const debug = debugFn(`users:audit`)

export class AuditCommand extends Command {

  static description = `list audit events`

  static enableJsonFlag = true

  static hidden = true

  static flags = {
    ...flags.subscriber,
    ...flags.pagingFlags,
    id: flags.string({
      hidden: true,
      char: `i`,
      required: false,
      multiple: false,
    }),
    [`timestamp-format`]: flags.enum({
      char: `f`,
      options: [`relative`, `none`],
      default: `none`,
      description: `Timestamp output format`,
    }),
    ...CliUx.ux.table.flags(),
  }

  async run(): Promise<Result<ProfileAuditEventResults, Error>> {
    const { flags } = await  this.parse(AuditCommand)
    const subscriberId = flags[`subscriber-id`]
    const userId = flags[`id`]
    const cursor = flags[`cursor`]
    const latest = flags[`latest`]
    const oldest = flags[`oldest`]
    const limit = flags[`limit`]
    const format = flags[`timestamp-format`]

    const response = await this.relay.profileAuditEvents(subscriberId, userId, { cursor, latest, oldest, limit })

    debug(`cursor`, response.cursor)
    debug(`results`, response.results)

    if (!this.jsonEnabled()) {
      const cursorOutput = !isEmpty(response.cursor) ? `(cursor => ${response.cursor})` : ``
      CliUx.ux.styledHeader(`User Assignment Results ${cursorOutput}`)
      if (!isEmpty(response.results)) {
        CliUx.ux.table(response.results, {
          id: {},
          action: {},
          device_id: {},
          timestamp_action: {
            header: `Timestamp`,
            get: row => getFormattedTimestamp(row.timestamp_action, format)
          },
        }, {
          ...flags,
          sort: `Name`,
        })
      } else {
        this.log(`No audit events match the filter`)
      }
    }

    return Ok(response)
  }
}
