// Copyright © 2022 Relay Inc.

import { CliUx } from '@oclif/core'

import { Command } from '../../lib/command'
import isEmpty from 'lodash/isEmpty'

import { printWorkflows } from '../../lib/utils'

import * as flags from '../../lib/flags'

// eslint-disable-next-line quotes
import debugFn = require('debug')
import { Err, Ok, Result } from 'ts-results'
import * as api from '../../lib/api'

const debug = debugFn(`workflow`)

export default class Workflow extends Command {
  static description = `List workflow configurations`
  static enableJsonFlag = true

  static flags = {
    ...flags.subscriber,
    ...CliUx.ux.table.flags(),
  }

  async run(): Promise<Result<api.Workflow[], Error>> {
    const { flags } = await this.parse(Workflow)
    try {
      const workflows = await this.relay.workflows(flags[`subscriber-id`])

      debug(`workflows`, workflows)

      if (isEmpty(workflows)) {
        this.log(`No Workflows have been created yet`)
      } else if (!this.jsonEnabled()) {
        printWorkflows(workflows, flags)
      }
      return Ok(workflows)

    } catch (err) {
      debug(err)
      return Err(this.safeError(err))
    }
  }
}
