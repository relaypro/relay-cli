// Copyright © 2022 Relay Inc.

import { ux } from '@oclif/core'
import { join, omit } from 'lodash-es'
import { Command } from '../../../lib/command.js'
import * as flags from '../../../lib/flags/index.js'

import debugFn from 'debug'
const debug = debugFn(`workflow`)

export class UnsetArgsCommand extends Command {

  static strict = false

  static description = `unset one or more workflow arguments`

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

    ux.action.start(`Unsetting args ${join(argv, `, `)} on Workflow ID: ${workflowId}`)

    const workflow = await this.relay.workflow(subscriberId, workflowId)
    if (workflow) {
      debug(`existing args`, workflow.config.trigger.start.workflow.args)
      workflow.config.trigger.start.workflow.args = omit(
        workflow.config.trigger.start.workflow.args,
        argv as string[],
      )
      await this.relay.saveWorkflow(subscriberId, workflow)
      ux.action.stop(`success`)
      ux.styledHeader(`New Workflow arguments`)
      ux.styledJSON(workflow.config.trigger.start.workflow.args)
    } else {
      ux.action.stop(`failed`)
      this.log(`Workflow ID does not exist: ${workflowId}`)
    }
  }
}
