// Copyright © 2023 Relay Inc.

import { Args, ux } from '@oclif/core'

import { Command } from '../../../lib/command.js'
import * as flags from '../../../lib/flags/index.js'
import { getTaskGroup } from '../../../lib/utils.js'

import confirm from '@inquirer/confirm'

import debugFn from 'debug'
const debug = debugFn(`task-groups:delete`)

export default class TaskGroupDeleteCommand extends Command {
  static description = `Delete a task group`
  static strict = false

  static flags = {
    ...flags.subscriber,
    ...flags.confirmFlags,
    ...ux.table.flags(),
  }

  static args = {
    name: Args.string({
      name: `name`,
      required: true,
      description: `Task group name`,
    })
  }

  async run(): Promise<void> {
    const { flags, args } = await this.parse(TaskGroupDeleteCommand)
    const subscriberId = flags[`subscriber-id`]
    const groupName = args.name

    try {
      const answer = flags.confirm ? true : await confirm({
        message: `Deleting "${groupName}". Are you sure?`
      })
      if (answer) {
        const groups = await this.relay.fetchTaskGroups(subscriberId)
        const group = getTaskGroup(groups, groupName)
        if (group) {
          const success = await this.relay.deleteTaskGroups(subscriberId, group.task_group_id)
          success ? this.log(`Successfully deleted task group "${groupName}"`) : this.log(`Could NOT delete task group "${groupName}"`)
        } else {
          this.log(`Task group does not exist: "${groupName}"`)
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
