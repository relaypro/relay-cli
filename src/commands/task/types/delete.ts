// Copyright © 2023 Relay Inc.

import * as flags from '../../../lib/flags'
// eslint-disable-next-line quotes
import debugFn = require('debug')

import { Command } from '../../../lib/command'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Confirm } = require('enquirer') // eslint-disable-line quotes

// eslint-disable-next-line @typescript-eslint/no-var-requires
const debug = debugFn(`task-types:delete`)

export default class TaskTypesDeleteCommand extends Command {

  static description = `Delete a task type. Must have admin priviledges and RELAY_ADMIN_TOKEN env variable set to run this command.`
  static strict = false


  static flags = {
    ...flags.subscriber
  }

  static args = [
    {
      name: `namespace`,
      required: true,
      description: `Namespace of the task type`,
      options: [`account`, `system`],
    },
    {
      name: `name`,
      required: true,
      description: `Task type name`,
    }
  ]

  async run(): Promise<void> {
    const { flags, argv } = await this.parse(TaskTypesDeleteCommand)
    const subscriberId = flags[`subscriber-id`]
    const namespace = argv[0] as string
    const name = argv[1] as string
    try {
      const prompt = new Confirm({
        name: `question`,
        message: `Deleting ${name}. Are you sure?`
      })
      const answer = await prompt.run()
      if (answer) {
        const success = await this.relay.deleteTaskType(subscriberId, name, namespace)
        success ? this.log(`Task type deleted`) : this.error(`Task type NOT deleted, make sure task type exists (relay task-types list types)`)
      } else {
        this.log(`Task type NOT deleted`)
      }
    } catch (err) {
      debug(err)
      this.safeError(err)
    }
  }
}
