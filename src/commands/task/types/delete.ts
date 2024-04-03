// Copyright © 2023 Relay Inc.

import { Args } from '@oclif/core'
import confirm from '@inquirer/confirm'

import * as flags from '../../../lib/flags/index.js'
import { Command } from '../../../lib/command.js'
import { namespace } from '../../../lib/args.js'

import debugFn from 'debug'
const debug = debugFn(`task:types:delete`)

export default class TaskTypesDeleteCommand extends Command {

  static description = `Delete a task type. Must have admin priviledges and RELAY_ADMIN_TOKEN env variable set to run this command.`
  static strict = false


  static flags = {
    ...flags.subscriber
  }

  static args = {
    namespace,
    name: Args.string({
      name: `name`,
      required: true,
      description: `Task type name`,
    })
  }

  async run(): Promise<void> {
    const { flags, args } = await this.parse(TaskTypesDeleteCommand)
    const subscriberId = flags[`subscriber-id`]
    const namespace = args.namespace
    const name = args.name
    try {
      const answer = await confirm({
        message: `Deleting ${name}. Are you sure?`
      })
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
