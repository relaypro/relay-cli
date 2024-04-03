// Copyright © 2022 Relay Inc.

import { ux } from '@oclif/core'

import { isEmpty } from 'lodash-es'

import { Command } from '../../lib/command.js'
import { printWorkflows } from '../../lib/utils.js'
import * as flags from '../../lib/flags/index.js'

import debugFn from 'debug'
import { Err, Ok, Result } from 'ts-results-es'
import * as api from '../../lib/api.js'

const debug = debugFn(`workflow`)

export default class Workflow extends Command {
  static description = `List workflow configurations`
  static enableJsonFlag = true

  static flags = {
    ...flags.subscriber,
    ...ux.table.flags(),
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
