// Copyright © 2023 Relay Inc.

import { CliUx } from '@oclif/core'

import { Command } from '../../../lib/command'
import * as flags from '../../../lib/flags'
import { isEmpty } from 'lodash'
import { printTaskTypes } from '../../../lib/utils'
// eslint-disable-next-line quotes
import debugFn = require('debug')

const debug = debugFn(`task-types:list`)

export default class TaskTypesListTypesCommand extends Command {
  static description = `List task type configurations`
  // static hidden = true

  static flags = {
    ...flags.subscriber,
    ...CliUx.ux.table.flags(),
    namespace: flags.string({
      char: `N`,
      required: true,
      multiple: false,
      default: `account`,
      options: [`account`, `system`],
      description: `Namespace of the task type`
    }),
  }
  async run(): Promise<void> {
    const { flags } = await this.parse(TaskTypesListTypesCommand)
    const subscriberId = flags[`subscriber-id`]

    try {
      const taskTypes = await this.relay.fetchTaskTypes(subscriberId, flags.namespace)

      debug(`task types`, taskTypes)

      if (!isEmpty(taskTypes)) {
        printTaskTypes(taskTypes, flags)
      } else {
        this.log(`No task types have been created yet`)
      }
    } catch (err) {
      debug(err)
      this.safeError(err)
    }

  }
}

