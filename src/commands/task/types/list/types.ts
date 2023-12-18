// Copyright © 2023 Relay Inc.

import { CliUx } from '@oclif/core'

import { Command } from '../../../../lib/command'
import * as flags from '../../../../lib/flags'
import { isEmpty } from 'lodash'
import { printTaskTypes } from '../../../../lib/utils'
// eslint-disable-next-line quotes
import debugFn = require('debug')
import { TaskType } from '../../../../lib/api'
import { Err, Ok, Result } from 'ts-results'

const debug = debugFn(`task-types:list`)

export default class TaskTypesListTypesCommand extends Command {
  static description = `List task type configurations`
  static strict = false
  static enableJsonFlag = true

  static flags = {
    ...flags.subscriber,
    ...CliUx.ux.table.flags()
  }

  static args = [
    {
      name: `namespace`,
      required: true,
      description: `Namespace of the task type`,
      options: [`account`, `system`],
      default: `account`,
    },
  ]
  async run(): Promise<Result<TaskType[], Error>> {
    const { flags, argv } = await this.parse(TaskTypesListTypesCommand)
    const subscriberId = flags[`subscriber-id`]
    const namespace = argv[0] as string
    try {
      const taskTypes = await this.relay.fetchTaskTypes(subscriberId, namespace)

      debug(`task types`, taskTypes)

      if (isEmpty(taskTypes)) {
        this.log(`No task types have been created yet`)
      } else if (!this.jsonEnabled()) {
        printTaskTypes(taskTypes, flags, namespace)
      }
      return Ok(taskTypes)
    } catch (err) {
      debug(err)
      return Err(this.safeError(err))
    }
  }
}

