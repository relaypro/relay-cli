// Copyright © 2023 Relay Inc.

import { CliUx } from '@oclif/core'

import { Command } from '../../lib/command'
import * as flags from '../../lib/flags'
import { isEmpty } from 'lodash'
import { printTaskTypes, printMajors, printMinors } from '../../lib/utils'
// eslint-disable-next-line quotes
import debugFn = require('debug')

const debug = debugFn(`task-types:list`)

export default class TaskTypesListCommand extends Command {
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
    types: flags.boolean({
      required: false,
      exclusive: [`type`, `majors`, `minors`],
      description: `List all task types for the namespace`
    }),
    type: flags.string({
      required: false,
      multiple: false,
      exclusive: [`types`],
      description: `Task type name`
    }),
    majors: flags.boolean({
      required: false,
      exclusive: [`types`],
      dependsOn: [`type`],
      description: `List all majors for the task type`
    }),
    minors: flags.boolean({
      required: false,
      exclusive: [`types`],
      dependsOn: [`type`, `major`],
      description: `List all minors for task type and major`
    }),
    major: flags.integer({
      required: false,
      exclusive: [`majors`, `types`], // can't do depends on?
      description: `Major version`
    })
  }
  async run(): Promise<void> {
    const { flags } = await this.parse(TaskTypesListCommand)
    const subscriberId = flags[`subscriber-id`]

    try {
      if (flags.types) {
        const taskTypes = await this.relay.fetchTaskTypes(subscriberId, flags.namespace)

        debug(`task types`, taskTypes)

        if (!isEmpty(taskTypes)) {
          printTaskTypes(taskTypes, flags)
        } else {
          this.log(`No task types have been created yet`)
        }
      } else if (flags.majors && flags.type) {
        const majors = await this.relay.fetchMajors(subscriberId, flags.namespace, flags.type)

        debug(`majors`, majors)

        printMajors(majors, flags, flags.type)
      } else if (flags.minors && flags.major && flags.type) {
        const minors = await this.relay.fetchMinors(subscriberId, flags.namespace, flags.type, flags.major)

        debug(`minors`, minors)

        printMinors(minors, flags, flags.type)
      }
    } catch (err) {
      debug(err)
      this.safeError(err)
    }

  }
}

