// Copyright © 2023 Relay Inc.

import { CliUx } from '@oclif/core'

import { Command } from '../../../lib/command'
import * as flags from '../../../lib/flags'
import { printMinors } from '../../../lib/utils'
// eslint-disable-next-line quotes
import debugFn = require('debug')

const debug = debugFn(`task-types:list`)

export default class TaskTypesListMinorsCommand extends Command {
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
      char: `t`,
      required: true,
      multiple: false,
      description: `Task type name`
    }),
    major: flags.integer({
      char: `m`,
      required: true,
      multiple: false,
      description: `Major version`
    })
  }
  async run(): Promise<void> {
    const { flags } = await this.parse(TaskTypesListMinorsCommand)
    const subscriberId = flags[`subscriber-id`]

    try {
      const minors = await this.relay.fetchMinors(subscriberId, flags.namespace, flags.type, flags.major)

      debug(`minors`, minors)

      printMinors(minors, flags, flags.type, false)

    } catch (err) {
      debug(err)
      this.safeError(err)
    }

  }
}



