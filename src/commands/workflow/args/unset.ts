// Copyright © 2022 Relay Inc.

import { CliUx } from '@oclif/core'
import { join, omit } from 'lodash'
import { Command } from '../../../lib/command'
import * as flags from '../../../lib/flags'

// eslint-disable-next-line quotes
import debugFn = require('debug')
const debug = debugFn(`workflow`)

export class UnsetArgsCommand extends Command {

  static strict = false

  static description = `Unset one or more workflow arguments`

  static flags = {
    [`workflow-id`]: flags.workflowId,
    ...flags.subscriber,
  }

  async run(): Promise<void> {
    const { argv, flags } = await this.parse(UnsetArgsCommand)
    const workflowId = flags[`workflow-id`]
    const subscriberId = flags[`subscriber-id`]

    if (argv.length === 0) {
      this.error(`Usage: relay workflow:args:unset KEY1 [KEY2 ...]\nMust specify KEY to unset.`)
    }

    debug(argv)

    CliUx.ux.action.start(`Unsetting args ${join(argv, `, `)} on Workflow ID: ${workflowId}`)

    const workflow = await this.relay.workflow(subscriberId, workflowId)
    if (workflow) {
      debug(`existing args`, workflow.config.trigger.start.workflow.args)
      workflow.config.trigger.start.workflow.args = omit(
        workflow.config.trigger.start.workflow.args,
        argv,
      )
      await this.relay.saveWorkflow(workflow)
      CliUx.ux.action.stop(`success`)
      CliUx.ux.styledHeader(`New Workflow arguments`)
      CliUx.ux.styledJSON(workflow.config.trigger.start.workflow.args)
    } else {
      CliUx.ux.action.stop(`failed`)
      this.log(`Workflow ID does not exist: ${workflowId}`)
    }
  }
}
