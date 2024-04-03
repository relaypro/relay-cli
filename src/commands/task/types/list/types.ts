// Copyright © 2023 Relay Inc.

import { ux } from '@oclif/core'

import { Command } from '../../../../lib/command.js'
import * as flags from '../../../../lib/flags/index.js'
import { isEmpty } from 'lodash-es'
import { printTaskTypes } from '../../../../lib/utils.js'
import debugFn from 'debug'
import { TaskType } from '../../../../lib/api.js'
import { Err, Ok, Result } from 'ts-results-es'
import { namespace } from '../../../../lib/args.js'

const debug = debugFn(`task:types:list`)

export default class TaskTypesListTypesCommand extends Command {
  static description = `List task type configurations`
  static strict = false
  static enableJsonFlag = true

  static flags = {
    ...flags.subscriber,
    ...ux.table.flags()
  }

  static args = {
    namespace
  }

  async run(): Promise<Result<TaskType[], Error>> {
    const { flags, args } = await this.parse(TaskTypesListTypesCommand)
    const subscriberId = flags[`subscriber-id`]
    const namespace = args.namespace
    try {
      const taskTypes = await this.relay.fetchTaskTypes(subscriberId, namespace)

      debug(`task types`, taskTypes)

      if (!this.jsonEnabled()) {
        if (isEmpty(taskTypes) && !flags.output) {
          this.log(`No task types have been created yet`)
        } else {
          printTaskTypes(taskTypes, flags, namespace)
        }
      }
      return Ok(taskTypes)
    } catch (err) {
      debug(err)
      return Err(this.safeError(err))
    }
  }
}
