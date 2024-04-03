// Copyright © 2023 Relay Inc.

import { ux } from '@oclif/core'
import { isEmpty } from 'lodash-es'
import { Err, Ok, Result } from 'ts-results-es'

import { Command } from '../../../lib/command.js'
import * as flags from '../../../lib/flags/index.js'
import { printDump } from '../../../lib/utils.js'
import { TaskTypeDump } from '../../../lib/api.js'
import { createTaskTypeDump } from '../../../lib/task-types.js'
import { namespace } from '../../../lib/args.js'

import debugFn from 'debug'
const debug = debugFn(`task:types:dump`)

export default class TaskTypesDumpCommand extends Command {
  static description = `Dumps task types along with their latest minor, major, and comment`
  static strict = false
  static enableJsonFlag = true


  static flags = {
    ...flags.subscriber,
    ...ux.table.flags()
  }

  static args = {
    namespace
  }

  async run(): Promise<Result<TaskTypeDump[], Error>> {
    const { flags, args } = await this.parse(TaskTypesDumpCommand)
    const subscriberId = flags[`subscriber-id`]
    const namespace = args.namespace

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
