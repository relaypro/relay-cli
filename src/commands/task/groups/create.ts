// Copyright © 2023 Relay Inc.

import { Command } from '../../../lib/command.js'
import * as flags from '../../../lib/flags/index.js'
import debugFn from 'debug'
import { taskGroupCreateArgs } from '../../../lib/args.js'
import { createTaskGroup } from '../../../lib/tasks.js'

const debug = debugFn(`task-groups:create`)

export default class TaskGroupsCreateCommand extends Command {
  static description = `Create a task group`
  static strict = false

  static flags = {
    ...flags.subscriber,
  }

  static args = {
    ...taskGroupCreateArgs
  }

  async run(): Promise<void> {
    const { flags, args: commandArgs } = await this.parse(TaskGroupsCreateCommand)
    const subscriberId = flags[`subscriber-id`]

    const members = JSON.parse(commandArgs.members)
    commandArgs.members = members

    try {
      const group = await createTaskGroup(commandArgs)
      const success = await this.relay.createTaskGroup(subscriberId, group)
      if (success) {
        this.log(`Successfully created task group`)
      } else {
        this.log(`Could not create task group`)
      }

    } catch (err) {
      debug(err)
      this.safeError(err)
    }
  }
}
