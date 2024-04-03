// Copyright © 2023 Relay Inc.


import * as flags from '../../lib/flags/index.js'
import { createTask } from '../../lib/tasks.js'
import { Command } from '../../lib/command.js'
import { taskStartArgs } from '../../lib/args.js'

import debugFn from 'debug'

const debug = debugFn(`tasks:start`)

export default class TasksStartCommand extends Command {

  static description = `Start a task with the given configuration`
  static strict = false

  static flags = {
    ...flags.subscriber,
    tag: flags.string({
      required: false,
      multiple: true,
      description: `Optional tag to tie to your task`
    })
  }

  static args = {
    ...taskStartArgs
  }

  async run(): Promise<void> {
    const { flags, args: commandArgs } = await this.parse(TasksStartCommand)
    const subscriberId = flags[`subscriber-id`]

    const startArgs = JSON.parse(commandArgs.args)
    startArgs.tags = [startArgs.type, ...(flags.tag ?? [])]
    commandArgs.args = startArgs

    try {
      const task = await createTask(startArgs)
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
