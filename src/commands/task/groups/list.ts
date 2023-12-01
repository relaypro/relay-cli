// Copyright © 2023 Relay Inc.

import { CliUx } from '@oclif/core'

import { Command } from '../../../lib/command'
import * as flags from '../../../lib/flags'
import {  printTaskGroups } from '../../../lib/utils'
// eslint-disable-next-line quotes
import debugFn = require('debug')
import { isEmpty } from 'lodash'
import { Err, Ok, Result } from 'ts-results'
import { TaskGroup } from '../../../lib/api'

const debug = debugFn(`task-groups:list`)

export default class TaskGroupsListCommand extends Command {
  static description = `List task groups`
  static strict = false
  static enableJsonFlag = true

  static hidden = true

  static flags = {
    ...flags.subscriber,
    ...CliUx.ux.table.flags(),
  }

  async run(): Promise<Result<TaskGroup[], Error>> {
    const { flags } = await this.parse(TaskGroupsListCommand)
    const subscriberId = flags[`subscriber-id`]
    const output = flags.output
    try {
      const groups = await this.relay.fetchTaskGroups(subscriberId)

      debug(`groups`, groups)

      if (isEmpty(groups)) {
        this.log(`No task groups have been created.`)
      } else if (!this.jsonEnabled()) {
        if (output == `json`) {
          this.log(JSON.stringify(groups)) // to make assign-to proper json
        } else {
          printTaskGroups(groups, flags)
        }
      }
      return Ok(groups)
    } catch (err) {
      debug(err)
      return Err(this.safeError(err))
    }
  }
}

