// Copyright © 2023 Relay Inc.

import { CliUx } from '@oclif/core'

import { Command } from '../../lib/command'
import * as flags from '../../lib/flags'
import { printMinors } from '../../lib/utils'
// eslint-disable-next-line quotes
import debugFn = require('debug')

const debug = debugFn(`task-types:list`)

export default class TaskTypesFetchCommand extends Command {
  static description = `fetch a specific task types major or minor`
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
    }),
    major: flags.integer({
      required: false,
      multiple: false,
      description: `Major version`
    }),
    minor: flags.integer({
      required: false,
      multiple: false,
      description: `Minor Version`
    }),
    latest: flags.boolean({
      required: false,
      description: `Retrieve the lastet major or minor`
    })
  }
  async run(): Promise<void> {
    const { flags } = await this.parse(TaskTypesFetchCommand)
    const subscriberId = flags[`subscriber-id`]

    try {
      if ((flags.minor )&& flags.major) {
        const minor = await this.relay.fetchMinor(subscriberId, flags.namespace, flags.type, flags.major, flags.minor, flags.latest)
      }

      debug(`minors`, minors)

      printMinors(minors, flags, flags.type)

    } catch (err) {
      debug(err)
      this.safeError(err)
    }

  }
}



