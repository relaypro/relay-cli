// Copyright © 2022 Relay Inc.

import { ux } from '@oclif/core'
import {
  join,
  keys,
} from 'lodash-es'

import { Command } from '../../../lib/command.js'
import * as flags from '../../../lib/flags/index.js'
import { mergeArgs } from '../../../lib/utils.js'

import debugFn from 'debug'
const debug = debugFn(`workflow`)

export class SetArgsCommand extends Command {

  static strict = false

  static description = `set one or more workflow arguments`

  static flags = {
    [`workflow-id`]: flags.workflowId,
    arg: flags.stringValue(),
    boolean: flags.booleanValue(),
    number: flags.numberValue(),
    ...flags.subscriber,
  }

  async run(): Promise<void> {
    const { flags,  /*raw*/ } = await this.parse(SetArgsCommand)
    const workflowId = flags[`workflow-id`]
    const subscriberId = flags[`subscriber-id`]

    try {
      const args = mergeArgs(flags.arg ?? [], flags.boolean ?? [], flags.number ?? [])

      debug(`args`, args)

      ux.action.start(`Setting args ${join(keys(args), `, `)} on Workflow ID: ${workflowId}`)

      const workflow = await this.relay.workflow(subscriberId, workflowId)

      if (workflow) {
        debug(`existing args`, workflow.config.trigger.start.workflow.args)
        workflow.config.trigger.start.workflow.args = {
          ...workflow.config.trigger.start.workflow.args,
          ...args,
        }
        await this.relay.saveWorkflow(subscriberId, workflow)
        ux.action.stop(`success`)
        ux.styledHeader(`New Workflow arguments`)
        ux.styledJSON(workflow.config.trigger.start.workflow.args)
      } else {
        ux.action.stop(`failed`)
        this.log(`Workflow ID does not exist: ${workflowId}`)
      }

    } catch (err) {
      debug(err)
      this.safeError(err)
    }
  }
}
