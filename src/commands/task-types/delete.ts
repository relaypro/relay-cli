// Copyright © 2023 Relay Inc.

import * as flags from '../../lib/flags'
// eslint-disable-next-line quotes
import debugFn = require('debug')

import { Command } from '../../lib/command'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Confirm } = require('enquirer') // eslint-disable-line quotes

// eslint-disable-next-line @typescript-eslint/no-var-requires
const debug = debugFn(`task-types:delete`)

export default class TaskTypesDeleteCommand extends Command {

  static description = `Delete a task type. Must have admin priviledges and RELAY_ADMIN_TOKEN env variable set to run this command.`
  // static hidden = true

  static flags = {
    ...flags.subscriber,
    namespace: flags.string({
      char: `N`,
      required: true,
      multiple: false,
      default: `account`,
      options: [`account`, `system`],
      description: `Namespace of the task type`
    }),
    name: flags.string({
      char: `n`,
      required: true,
      multiple: false,
      description: `Name of task type to delete.`
    }),
  }

  async run(): Promise<void> {
    const { flags } = await this.parse(TaskTypesDeleteCommand)
    const subscriberId = flags[`subscriber-id`]
    try {
      const prompt = new Confirm({
        name: `question`,
        message: `Deleting ${flags.name}. Are you sure?`
      })
      const answer = await prompt.run()
      if (answer) {
        const success = await this.relay.deleteTaskType(subscriberId, flags.name, flags.namespace)
        success ? this.log(`Task type deleted`) : this.log(`Task type NOT deleted`)
      } else {
        this.log(`Task type NOT deleted`)
      }
    } catch (err) {
      debug(err)
      this.safeError(err)
    }
  }
}
