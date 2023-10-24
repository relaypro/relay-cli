// Copyright © 2023 Relay Inc.

import { CliUx } from '@oclif/core'

import { Command } from '../../../lib/command'
import * as flags from '../../../lib/flags'
import { isEmpty } from 'lodash'
import { printTaskTypes, printMajors, printMinors } from '../../../lib/utils'
// eslint-disable-next-line quotes
import debugFn = require('debug')

const debug = debugFn(`task-types:list`)

export default class TaskTypesListMajorsCommand extends Command {
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
    type: flags.string({
      required: true,
      multiple: false,
      description: `Task type name`
    })
  }
  async run(): Promise<void> {
    const { flags } = await this.parse(TaskTypesListMajorsCommand)
    const subscriberId = flags[`subscriber-id`]

    try {
      const majors = await this.relay.fetchMajors(subscriberId, flags.namespace, flags.type)

      debug(`majors`, majors)

      printMajors(majors, flags, flags.type)

    } catch (err) {
      debug(err)
      this.safeError(err)
    }

  }
}