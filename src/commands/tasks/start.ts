import * as fs from 'fs'
import * as flags from '../../lib/flags'
// eslint-disable-next-line quotes
import debugFn = require('debug')

import { createTask } from '../../lib/tasks'
import { Command } from '../../lib/command'

const debug = debugFn(`tasks:start`)

export default class TasksStartCommand extends Command {

  static description = `Start a task with the given configuration`
  // static hidden = true

  static flags = {
    ...flags.subscriber,
    ...flags.taskStartFlags,
  }

  async run(): Promise<void> {
    const { flags } = await this.parse(TasksStartCommand)
    const subscriberId = flags[`subscriber-id`]

    let encoded_string = flags.args
    if (encoded_string.charAt(0) == `@`) {
      encoded_string = fs.readFileSync(encoded_string.substring(1, encoded_string.length),{ encoding: `utf8`, flag: `r` }).toString()
    }

    const args = JSON.parse(encoded_string)
    args.tags = [flags.type, ...(flags.tag ?? [])]

    const newTask = {
      ...flags,
      args,
    }

    try {
      const task = await createTask(newTask)
      const success = await this.relay.startTask(subscriberId, task)

      if (success) {
        this.log(`Successfully started task`)
      } else {
        this.log(`Could not start task`)
      }

    } catch (err) {
      debug(err)
      this.safeError(err)
    }
  }
}

