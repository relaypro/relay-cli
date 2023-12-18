// Copyright © 2023 Relay Inc.

import { CliUx } from '@oclif/core'

import { Command } from '../../lib/command'
import * as flags from '../../lib/flags'
import { isEmpty } from 'lodash'
import { filterByTag, getTaskGroup, printScheduledTasks, printTasks } from '../../lib/utils'
// eslint-disable-next-line quotes
import debugFn = require('debug')

import { ScheduledTask, Task } from '../../lib/api'
import { Err, Ok, Result } from 'ts-results'

const debug = debugFn(`tasks:list`)

export default class TaskListCommand extends Command {
  static description = `List task configurations`
  static enableJsonFlag = true


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
      description: `Tag`,
      exclusive: [`group-name`]
    }),
    [`group-name`]: flags.string({
      required: false,
      multiple: false,
      char: `g`,
      description: `Group name`,
      exclusive: [`tag`]
    })
  }
  async run(): Promise<Result<Task[], Error>> {
    const { flags } = await this.parse(TaskListCommand)
    const subscriberId = flags[`subscriber-id`]
    const groupName = flags[`group-name`]
    const output = flags.output
    try {
      let taskEndpoint
      let tasks
      if (flags.scheduled) {
        taskEndpoint = `scheduled_task`
      } else {
        taskEndpoint = `task`
      }
      if (groupName) {
        const groups = await this.relay.fetchTaskGroups(subscriberId)
        const group = getTaskGroup(groups, groupName)
        if (group == undefined) {
          this.error(`No group found with name ${groupName}`)
        } else {
          tasks = await this.relay.fetchTasks(subscriberId, taskEndpoint, group?.task_group_id)
        }
      } else {
        tasks = await this.relay.fetchTasks(subscriberId, taskEndpoint)
      }
      if (flags.tag) {
        tasks = filterByTag(tasks, flags.tag)
      }

      debug(`tasks`, tasks)

      if (isEmpty(tasks)) {
        this.log(`No tasks have been ${flags.scheduled ? `scheduled` : `started`} yet${groupName ? ` with group name ${groupName}` : ``}`)
      } else if (!this.jsonEnabled()) {
        if (output == `json`) {
          this.log(JSON.stringify(tasks))
        } else if (flags.scheduled) {
          printScheduledTasks((tasks as ScheduledTask[]), flags)
        } else {
          printTasks(tasks, flags)
        }
      }
      return Ok(tasks)
    } catch (err) {
      debug(err)
      return Err(this.safeError(err))
    }
  }
}

