import { Command } from '../../lib/command'
import * as flags from '../../lib/flags'
import { filterByTag } from '../../lib/utils'
// eslint-disable-next-line quotes
import debugFn = require('debug')

const debug = debugFn(`task`)

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Confirm } = require('enquirer') // eslint-disable-line quotes

export default class TaskDeleteCommand extends Command {
  static description = `Delete a running or scheduled task`
  // static hidden = true

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
      multiple: false,
      exclusive: [`task-id`],
      description: `Delete all tasks with the specified tag`
    })
  }
  async run(): Promise<void> {
    const { flags } = await  this.parse(TaskDeleteCommand)
    const taskId = flags[`task-id`]
    const subscriberId = flags[`subscriber-id`]
    const scheduled = flags[`scheduled`]

    let taskEndpoint
    if (scheduled) {
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
          await this.relay.deleteTask(subscriberId, taskEndpoint, taskId)
        }
        else if (flags.tag) {
          let tasks = await this.relay.fetchTasks(subscriberId, taskEndpoint)
          tasks = filterByTag(tasks, flags.tag)
          for (const task of tasks) {
            await this.relay.deleteTask(subscriberId, taskEndpoint, task.task_id)
          }
        }
      } else {
        this.log(`Task NOT deleted`)
      }
    } catch (err) {
      debug(err)
      this.safeError(err)
    }
  }
}

