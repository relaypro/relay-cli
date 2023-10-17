// Copyright © 2022 Relay Inc.

import { CliUx } from '@oclif/core'

import { Command } from '../../lib/command'
import * as flags from '../../lib/flags'

// eslint-disable-next-line quotes
import debugFn = require('debug')
import { ResourceFolder } from '../../lib/api'
import { Ok, Result } from 'ts-results'
import { isEmpty } from 'lodash'
import { RESOURCE_PREFIX } from '../../lib/constants'

const debug = debugFn(`group`)


export class GroupListCommand extends Command {

  static description = `Lists all groups.`

  static enableJsonFlag = true

  static flags = {
    ...flags.subscriber,
    ...CliUx.ux.table.flags(),
  }

  async run(): Promise<Result<ResourceFolder[], Error>> {
    const { flags } = await this.parse(GroupListCommand)

    const { results } = await this.relay.fetchResourceGroups(flags[`subscriber-id`])
    const groups = results.folders
    debug(`groups`, groups)

    if (!this.jsonEnabled()) {
      CliUx.ux.styledHeader(`Groups`)

      if (!isEmpty(groups)) {
        CliUx.ux.table(groups, {
          folder_name: {
            header: `Group`,
            minWidth: 25,
          },
          resource_folder_id: {
            header: `Install Rule ID`,
            get: row => `${RESOURCE_PREFIX}${row.resource_folder_id}`
          },
        }, {
          ...flags
        })
      } else {
        this.log(`No tags configured`)
      }

    }

    return Ok(groups)
  }
}
