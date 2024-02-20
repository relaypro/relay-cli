// Copyright © 2023 Relay Inc.

import { CliUx } from '@oclif/core'

import { Command } from '../../../../lib/command'
import * as flags from '../../../../lib/flags'
import { printMinors } from '../../../../lib/utils'
// eslint-disable-next-line quotes
import debugFn = require('debug')
import { isEmpty } from 'lodash'
import { Minor } from '../../../../lib/api'
import { Err, Ok, Result } from 'ts-results'

const debug = debugFn(`task-types:list`)

export default class TaskTypesListMinorsCommand extends Command {
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

  async run(): Promise<Result<Minor[], Error>> {
    const { flags, argv } = await this.parse(TaskTypesListMinorsCommand)
    const subscriberId = flags[`subscriber-id`]
    const namespace = argv[0] as string
    const type = argv[1] as string
    const major = argv[2] as string
    try {
      const minors = await this.relay.fetchMinors(subscriberId, namespace, type, major)

      debug(`minors`, minors)

      if (!this.jsonEnabled()) {
        if (isEmpty(minors) && !flags.output) {
          this.error(`No minors found. Check namespace, type and major args.`)
        } else {
          printMinors(minors, flags, type, false, namespace)
        }
      }
      return Ok(minors)
    } catch (err) {
      debug(err)
      return Err(this.safeError(err))
    }
  }
}
