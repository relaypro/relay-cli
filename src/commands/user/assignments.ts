// Copyright © 2022 Relay Inc.

import { ux } from '@oclif/core'
import { Command } from '../../lib/command.js'
import * as flags from '../../lib/flags/index.js'

import debugFn from 'debug'
import { ProfileAuditEventResults } from '../../lib/api.js'
import { Ok, Result } from 'ts-results-es'
import { isEmpty } from 'lodash-es'
import { getFormattedTimestamp } from '../../lib/datetime.js'

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
    [`timestamp-format`]: flags.string({
      char: `f`,
      options: [`relative`, `none`],
      default: `none`,
      description: `Timestamp output format`,
    }),
    ...ux.table.flags(),
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
      ux.styledHeader(`User Assignment Results ${cursorOutput}`)
      if (!isEmpty(response.results)) {
        ux.table(response.results, {
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
