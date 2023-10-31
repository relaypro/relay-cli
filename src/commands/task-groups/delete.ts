// Copyright © 2023 Relay Inc.

import { CliUx } from '@oclif/core'

import { Command } from '../../lib/command'
import * as flags from '../../lib/flags'
// eslint-disable-next-line quotes
import debugFn = require('debug')

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Confirm } = require('enquirer') // eslint-disable-line quotes

const debug = debugFn(`task-groups:delete`)

export default class TaskGroupDeleteCommand extends Command {
  static description = `Delete a task group`
  static strict = false

  // static hidden = true

  static flags = {
    ...flags.subscriber,
    ...CliUx.ux.table.flags(),
  }

  static args = [
    {
      name: `group id`,
      required: true,
      description: `Task group ID`,
    }
  ]

  async run(): Promise<void> {
    const { flags, argv } = await this.parse(TaskGroupDeleteCommand)
    const subscriberId = flags[`subscriber-id`]
    const groupId = argv[0] as string

    try {
      const prompt = new Confirm({
        name: `question`,
        message: `Deleting ${groupId}. Are you sure?`
      })
      const answer = await prompt.run()
      if (answer) {
        const success = await this.relay.deleteTaskGroups(subscriberId, groupId)
        success ? this.log(`Successfully Deleted Task Group ID ${groupId}`) : this.error(`Could not delete ${groupId}. Check that you have the correct ID (relay task-groups list).`)
      } else {
        this.log(`Task group ID NOT deleted`)
      }

    } catch (err) {
      debug(err)
      this.safeError(err)
    }

  }
}

