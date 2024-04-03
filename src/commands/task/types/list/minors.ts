// Copyright © 2023 Relay Inc.

import { ux } from '@oclif/core'
import { isEmpty } from 'lodash-es'
import { Err, Ok, Result } from 'ts-results-es'

import { Command } from '../../../../lib/command.js'
import * as flags from '../../../../lib/flags/index.js'
import { printMinors } from '../../../../lib/utils.js'
import { Minor } from '../../../../lib/api.js'
import { major, namespace, type } from '../../../../lib/args.js'

import debugFn from 'debug'
const debug = debugFn(`task:types:list`)

export default class TaskTypesListMinorsCommand extends Command {
  static description = `List task type configurations`
  static strict = false
  static enableJsonFlag = true

  static flags = {
    ...flags.subscriber,
    ...ux.table.flags()
  }

  static args = {
    namespace,
    type,
    major,
  }

  async run(): Promise<Result<Minor[], Error>> {
    const { flags, args } = await this.parse(TaskTypesListMinorsCommand)
    const subscriberId = flags[`subscriber-id`]
    const namespace = args.namespace
    const type = args.type
    const major = args.major
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
