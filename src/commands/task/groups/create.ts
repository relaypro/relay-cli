// Copyright © 2023 Relay Inc.

import * as fs from 'fs'

import { Command } from '../../../lib/command'
import * as flags from '../../../lib/flags'
// eslint-disable-next-line quotes
import debugFn = require('debug')
import { taskGroupCreateArgs, CreateTaskGroupArgs, createTaskGroupArgs } from '../../../lib/args'
import { createTaskGroup } from '../../../lib/tasks'

const debug = debugFn(`task-groups:create`)

export default class TaskGroupsCreateCommand extends Command {
  static description = `Create a task group`
  static strict = false

  static flags = {
    ...flags.subscriber,
  }

  static args = [
    ...taskGroupCreateArgs
  ]

  async run(): Promise<void> {
    const { flags, argv } = await this.parse(TaskGroupsCreateCommand)
    const subscriberId = flags[`subscriber-id`]
    const taskGroupArgs: CreateTaskGroupArgs = createTaskGroupArgs(argv)

    let encoded_string = taskGroupArgs.members as string
    if (encoded_string.charAt(0) == `@`) {

      const stats = fs.statSync(encoded_string.substring(1, encoded_string.length))
      const fileSizeInMegabytes = stats.size / (1024*1024)
      if (fileSizeInMegabytes > 10) {
        this.error(`members file is too large`)
      }

      encoded_string = fs.readFileSync(encoded_string.substring(1, encoded_string.length),{ encoding: `utf8`, flag: `r` }).toString()
    }

    taskGroupArgs.members = JSON.parse(encoded_string)

    try {
      const group = await createTaskGroup(taskGroupArgs)
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