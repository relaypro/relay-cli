// Copyright © 2023 Relay Inc.

import { ux } from '@oclif/core'

import { isEmpty } from 'lodash-es'
import { Err, Ok, Result } from 'ts-results-es'

import { Command } from '../../../../lib/command.js'
import * as flags from '../../../../lib/flags/index.js'
import {  printMajors } from '../../../../lib/utils.js'
import { Major } from '../../../../lib/api.js'
import { namespace, type } from '../../../../lib/args.js'

import debugFn from 'debug'
const debug = debugFn(`task:types:list`)

export default class TaskTypesListMajorsCommand extends Command {
  static description = `List task type configurations`
  static strict = false
  static enableJsonFlag = true

  static flags = {
    ...flags.subscriber,
    ...ux.table.flags(),
  }

  static args = {
    namespace,
    type,
  }

  async run(): Promise<Result<Major[], Error>> {
    const { flags, args } = await this.parse(TaskTypesListMajorsCommand)
    const subscriberId = flags[`subscriber-id`]
    const namespace = args.namespace
    const type = args.type
    try {
      const majors = await this.relay.fetchMajors(subscriberId, namespace, type)

      debug(`majors`, majors)

      if (!this.jsonEnabled()) {
        if (isEmpty(majors) && !flags.output) {
          this.error(`No majors found: Check namespace and type args.`)
        } else {
          printMajors(majors, flags, type, namespace)
        }
      }
      return Ok(majors)
    } catch (err) {
      debug(err)
      return Err(this.safeError(err))
    }
  }
}
