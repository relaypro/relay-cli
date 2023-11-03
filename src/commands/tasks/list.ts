// Copyright © 2023 Relay Inc.

import { CliUx } from '@oclif/core'

import { Command } from '../../lib/command'
import * as flags from '../../lib/flags'
import { isEmpty } from 'lodash'
import { filterByTag, printScheduledTasks, printTasks } from '../../lib/utils'
// eslint-disable-next-line quotes
import debugFn = require('debug')

import { ScheduledTask } from '../../lib/api'

const debug = debugFn(`tasks:list`)

export default class TaskListCommand extends Command {
  static description = `List task configurations`
  // static hidden = true

  static flags = {
    ...flags.subscriber,
    ...CliUx.ux.table.flags(),
    scheduled: flags.boolean({
      description: `List scheduled tasks`,
      required: false,
    }),
    tag: flags.string({
      required: false,
      multiple: true,
      char: `t`,
      description: `Tag`
    }),
    [`group-id`]: flags.string({
      required: false,
      multiple: false,
      char: `g`,
      description: `Group ID`
    })
  }
  async run(): Promise<void> {
    const { flags } = await this.parse(TaskListCommand)
    const subscriberId = flags[`subscriber-id`]
    const groupId = flags[`group-id`]

    try {
      let taskEndpoint
      if (flags.scheduled) {
        taskEndpoint = `scheduled_task`
      } else {
        taskEndpoint = `task`
      }

      let tasks = await this.relay.fetchTasks(subscriberId, groupId as string, taskEndpoint)

      debug(`tasks`, tasks)

      if (!isEmpty(tasks)) {
        if (flags.tag) {
          tasks = filterByTag(tasks, flags.tag)
        }
        if (flags.scheduled) {
          printScheduledTasks((tasks as ScheduledTask[]), flags)
        } else {
          printTasks(tasks, flags)
        }
      } else {
        this.log(`No tasks have been ${flags.scheduled ? `scheduled` : `started`} yet${groupId ? ` with group ID ${groupId}` : ``}`)
      }
    } catch (err) {
      debug(err)
      this.safeError(err)
    }

  }
}

