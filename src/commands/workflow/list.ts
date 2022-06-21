// Copyright © 2022 Relay Inc.

import { CliUx } from '@oclif/core'

import { Command } from '../../lib/command'
import isEmpty from 'lodash/isEmpty'

import { printWorkflows } from '../../lib/utils'

import * as flags from '../../lib/flags'

// eslint-disable-next-line quotes
import debugFn = require('debug')

const debug = debugFn(`workflow`)

export default class Workflow extends Command {
  static description = `List workflow configurations`

  static flags = {
    ...flags.subscriber,
    ...CliUx.ux.table.flags(),
  }

  async run(): Promise<void> {
    const { flags } = await this.parse(Workflow)

    try {
      const workflows = await this.relay.workflows(flags[`subscriber-id`])

      debug(workflows)

      if (!isEmpty(workflows)) {
        printWorkflows(workflows, flags)
      } else {
        this.log(`No Workflows have been created yet`)
      }

    } catch (err) {
      debug(err)
      this.safeError(err)
    }
  }
}
