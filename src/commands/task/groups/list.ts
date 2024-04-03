// Copyright © 2023 Relay Inc.

import { ux } from '@oclif/core'

import { Command } from '../../../lib/command.js'
import * as flags from '../../../lib/flags/index.js'
import {  printTaskGroups } from '../../../lib/utils.js'
import debugFn from 'debug'
import { isEmpty } from 'lodash-es'
import { Err, Ok, Result } from 'ts-results-es'
import { TaskGroup } from '../../../lib/api.js'

const debug = debugFn(`task-groups:list`)

export default class TaskGroupsListCommand extends Command {
  static description = `List task groups`
  static strict = false
  static enableJsonFlag = true

  static flags = {
    ...flags.subscriber,
    ...ux.table.flags(),
  }

  async run(): Promise<Result<TaskGroup[], Error>> {
    const { flags } = await this.parse(TaskGroupsListCommand)
    const subscriberId = flags[`subscriber-id`]
    try {
      const groups = await this.relay.fetchTaskGroups(subscriberId)

      debug(`groups`, groups)

      if (!this.jsonEnabled()) {
        if (isEmpty(groups) && !flags.output) {
          this.log(`No task groups have been created.`)
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
