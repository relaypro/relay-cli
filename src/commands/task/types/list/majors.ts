// Copyright © 2023 Relay Inc.

import { CliUx } from '@oclif/core'

import { Command } from '../../../../lib/command'
import * as flags from '../../../../lib/flags'
import {  printMajors } from '../../../../lib/utils'
// eslint-disable-next-line quotes
import debugFn = require('debug')
import { isEmpty } from 'lodash'
import { Err, Ok, Result } from 'ts-results'
import { Major } from '../../../../lib/api'

const debug = debugFn(`task-types:list`)

export default class TaskTypesListMajorsCommand extends Command {
  static description = `List task type configurations`
  static strict = false
  static enableJsonFlag = true

  static flags = {
    ...flags.subscriber,
    ...CliUx.ux.table.flags(),
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
    }
  ]
  async run(): Promise<Result<Major[], Error>> {
    const { flags, argv } = await this.parse(TaskTypesListMajorsCommand)
    const subscriberId = flags[`subscriber-id`]
    const namespace = argv[0] as string
    const type = argv[1] as string
    try {
      const majors = await this.relay.fetchMajors(subscriberId, namespace, type)

      debug(`majors`, majors)

      if (isEmpty(majors)) {
        this.error(`No majors found: Check namespace and type args.`)
      } else if (!this.jsonEnabled()) {
        printMajors(majors, flags, type, namespace)
      }
      return Ok(majors)
    } catch (err) {
      debug(err)
      return Err(this.safeError(err))
    }
  }
}