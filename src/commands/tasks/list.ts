import { CliUx } from '@oclif/core'

import { Command } from '../../lib/command'
import * as flags from '../../lib/flags'
import { isEmpty } from 'lodash'
import { filterByTag, printScheduledTasks, printTasks } from '../../lib/utils'
// eslint-disable-next-line quotes
import debugFn = require('debug')

const debug = debugFn(`task`)

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
      multiple: false,
      description: `Optional tag to tie to your task`
    })
  }
  async run(): Promise<void> {
    const { flags } = await this.parse(TaskListCommand)
    const subscriberId = flags[`subscriber-id`]
    const scheduled = flags[`scheduled`]

    try {
      let taskEndpoint
      if (scheduled) {
        taskEndpoint = `scheduled_task`
      } else {
        taskEndpoint = `task`
      }

      let tasks = await this.relay.fetchTasks(subscriberId, taskEndpoint)

      debug(`tasks`, tasks)

      if (!isEmpty(tasks)) {
        if (flags.tag) {
          tasks = filterByTag(tasks, flags.tag)
        }
        if (scheduled) {
          printScheduledTasks(tasks, flags)
        } else {
          printTasks(tasks, flags)
        }
      } else {
        this.log(`No tasks have been started or scheduled yet`)
      }
    } catch (err) {
      debug(err)
      this.safeError(err)
    }

  }
}

