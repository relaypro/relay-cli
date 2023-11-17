// Copyright © 2023 Relay Inc.

import { ScheduledTask } from '../../lib/api'
import { Command } from '../../lib/command'
import * as flags from '../../lib/flags'
import { filterByTag } from '../../lib/utils'
// eslint-disable-next-line quotes
import debugFn = require('debug')

const debug = debugFn(`tasks:delete`)

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Confirm } = require('enquirer') // eslint-disable-line quotes

export default class TaskDeleteCommand extends Command {
  static description = `Delete a running or scheduled task`
  static hidden = true

  static flags = {
    ...flags.subscriber,
    scheduled: flags.boolean({
      required: false,
      description: `Delete a scheduled task`,
    }),
    [`task-id`]: flags.string({
      char: `i`,
      required: false,
      multiple: false,
      exclusive: [`tag`],
      description: `Task identifier to delete`,
    }),
    tag: flags.string({
      required: false,
      multiple: true,
      exclusive: [`task-id`],
      description: `Delete all tasks with the specified tag`
    })
  }
  async run(): Promise<void> {
    const { flags } = await  this.parse(TaskDeleteCommand)
    const taskId = flags[`task-id`]
    const subscriberId = flags[`subscriber-id`]

    if (!taskId && !flags.tag) {
      this.error(`Must specify either a task id or tag to delete`)
      return
    }

    let taskEndpoint
    if (flags.scheduled) {
      taskEndpoint = `scheduled_task`
    } else {
      taskEndpoint = `task`
    }

    debug(`flags`, flags)

    try {
      const prompt = new Confirm({
        name: `question`,
        message: `Deleting ${taskId ?? flags.tag}. Are you sure?`
      })

      const answer = await prompt.run()

      if (answer) {
        if (taskId) {
          const success = await this.relay.deleteTask(subscriberId, taskEndpoint, taskId)
          success ? this.log(`Task deleted`) : this.error(`Task NOT deleted, make sure task exists (relay tasks list)`)
        }
        else if (flags.tag) {
          let tasks = await this.relay.fetchTasks(subscriberId, taskEndpoint)
          tasks = filterByTag(tasks, flags.tag)
          if (tasks.length > 0) {
            for (const task of tasks) {

              const id = flags.scheduled ? (task as ScheduledTask).scheduled_task_id : task.task_id

              await this.relay.deleteTask(subscriberId, taskEndpoint, id)
            }
            this.log(`Tasks deleted`)
          } else {
            this.log(`No tasks matching the tags: ${flags.tag}`)
          }
        }
      } else {
        this.log(`Task${taskId ? `` : `s`} NOT deleted`)
      }
    } catch (err) {
      debug(err)
      this.safeError(err)
    }
  }
}
