// Copyright © 2022 Relay Inc.

import { ux } from '@oclif/core'

import { Command } from '../../lib/command.js'
import * as flags from '../../lib/flags/index.js'

import debugFn from 'debug'
import { ResourceFolder } from '../../lib/api.js'
import { Ok, Result } from 'ts-results-es'
import { isEmpty } from 'lodash-es'
import { RESOURCE_PREFIX } from '../../lib/constants.js'

const debug = debugFn(`group`)


export class GroupListCommand extends Command {

  static description = `Lists all groups.`

  static enableJsonFlag = true

  static flags = {
    ...flags.subscriber,
    ...ux.table.flags(),
  }

  async run(): Promise<Result<ResourceFolder[], Error>> {
    const { flags } = await this.parse(GroupListCommand)

    const { results } = await this.relay.fetchResourceGroups(flags[`subscriber-id`])
    const groups = results.folders
    debug(`groups`, groups)

    if (!this.jsonEnabled()) {
      ux.styledHeader(`Groups`)

      if (!isEmpty(groups)) {
        ux.table(groups, {
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
