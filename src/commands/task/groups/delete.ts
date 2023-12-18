// Copyright © 2023 Relay Inc.

import { CliUx } from '@oclif/core'

import { Command } from '../../../lib/command'
import * as flags from '../../../lib/flags'
// eslint-disable-next-line quotes
import debugFn = require('debug')
import { getTaskGroup } from '../../../lib/utils'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Confirm } = require('enquirer') // eslint-disable-line quotes

const debug = debugFn(`task-groups:delete`)

export default class TaskGroupDeleteCommand extends Command {
  static description = `Delete a task group`
  static strict = false

  static flags = {
    ...flags.subscriber,
    ...CliUx.ux.table.flags(),
  }

  static args = [
    {
      name: `group name`,
      required: true,
      description: `Task group name`,
    }
  ]

  async run(): Promise<void> {
    const { flags, argv } = await this.parse(TaskGroupDeleteCommand)
    const subscriberId = flags[`subscriber-id`]
    const groupName = argv[0] as string

    try {
      const prompt = new Confirm({
        name: `question`,
        message: `Deleting ${groupName}. Are you sure?`
      })
      const answer = await prompt.run()
      if (answer) {
        const groups = await this.relay.fetchTaskGroups(subscriberId)
        const group = getTaskGroup(groups, groupName)
        if (group) {
          const success = await this.relay.deleteTaskGroups(subscriberId, group.task_group_id)
          success ? this.log(`Successfully deleted task group ${groupName}`) : this.log(`Could NOT delete task group ${groupName}`)
        } else {
          this.log(`Task group does not exist: ${groupName}`)
        }
      } else {
        this.log(`Task group NOT deleted`)
      }

    } catch (err) {
      debug(err)
      this.safeError(err)
    }

  }
}

