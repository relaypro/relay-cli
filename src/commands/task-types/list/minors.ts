// Copyright © 2023 Relay Inc.

import { CliUx } from '@oclif/core'

import { Command } from '../../../lib/command'
import * as flags from '../../../lib/flags'
import { printMinors } from '../../../lib/utils'
// eslint-disable-next-line quotes
import debugFn = require('debug')
import { isEmpty } from 'lodash'

const debug = debugFn(`task-types:list`)

export default class TaskTypesListMinorsCommand extends Command {
  static description = `List task type configurations`
  static strict = false

  // static hidden = true

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
    },
    {
      name: `type`,
      required: true,
      description: `Task type name`,
    },
    {
      name: `major`,
      required: true,
      description: `Major version`,
    }
  ]

  async run(): Promise<void> {
    const { flags, argv } = await this.parse(TaskTypesListMinorsCommand)
    const subscriberId = flags[`subscriber-id`]
    const namespace = argv[0] as string
    const type = argv[1] as string
    const major = argv[2] as string

    try {
      const minors = await this.relay.fetchMinors(subscriberId, namespace, type, major)

      debug(`minors`, minors)

      if (isEmpty(minors)) {
        this.error(`No minors found. Check namespace, type and major args.`)
      }

      printMinors(minors, flags, flags.type, false)

    } catch (err) {
      debug(err)
      this.safeError(err)
    }

  }
}



