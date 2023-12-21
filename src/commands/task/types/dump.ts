// Copyright © 2023 Relay Inc.

import { CliUx } from '@oclif/core'

import { Command } from '../../../lib/command'
import * as flags from '../../../lib/flags'
// eslint-disable-next-line quotes
import debugFn = require('debug')
import { printDump } from '../../../lib/utils'
import { TaskTypeDump } from '../../../lib/api'
import { createTaskTypeDump } from '../../../lib/task-types'
import { Err, Ok, Result } from 'ts-results'
import { isEmpty } from 'lodash'

const debug = debugFn(`task:types:dump`)

export default class TaskTypesDumpCommand extends Command {
  static description = `Dumps task types along with their latest minor, major, and comment`
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
      hidden: false
    }
  ]
  async run(): Promise<Result<TaskTypeDump[], Error>> {
    const { flags, argv } = await this.parse(TaskTypesDumpCommand)
    const subscriberId = flags[`subscriber-id`]
    const namespace = argv[0] as string

    try {
      const latestTaskTypes: TaskTypeDump[] = []
      const taskTypes = await this.relay.fetchTaskTypes(subscriberId, namespace)

      for (const type of taskTypes) {
        const major = await this.relay.fetchMajor(subscriberId, namespace, type.name, `latest`)
        const minor = await this.relay.fetchMinor(subscriberId, namespace, type.name, major.major, `latest`)
        const taskTypeDump = await createTaskTypeDump(type.name, major.major, minor.minor, minor.comment)
        latestTaskTypes.push(taskTypeDump)
      }
      if (isEmpty(latestTaskTypes)) {
        this.log(`No task types have been created`)
      } else if (!this.jsonEnabled()) {
        printDump(latestTaskTypes, flags, namespace)
      }
      return Ok(latestTaskTypes)
    } catch (err) {
      debug(err)
      return Err(this.safeError(err))
    }

  }
}



