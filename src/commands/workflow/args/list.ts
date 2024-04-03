// Copyright © 2022 Relay Inc.

import { ux } from '@oclif/core'
import { map } from 'lodash-es'
import { Command } from '../../../lib/command.js'
import * as flags from '../../../lib/flags/index.js'

import debugFn from 'debug'
const debug = debugFn(`workflow`)

export class SetArgsCommand extends Command {

  static description = `List a workflow's args`

  static flags = {
    [`workflow-id`]: flags.workflowId,
    ...flags.subscriber,
  }

  async run(): Promise<void> {
    const { flags } = await this.parse(SetArgsCommand)
    const workflowId = flags[`workflow-id`]
    const subscriberId = flags[`subscriber-id`]

    try {
      const workflow = await this.relay.workflow(subscriberId, workflowId)

      if (workflow) {
        ux.styledHeader(`Workflow arguments for ID ${workflowId}`)
        const args = workflow?.config?.trigger?.start?.workflow?.args||{}
        const mappedArgs = map(args, (value, arg) => ({ arg, value, type: typeof value }))
        ux.table(mappedArgs, {
          arg: {},
          value: {},
          type: {}
        }, {

        })
      } else {
        this.log(`Workflow ID does not exist: ${workflowId}`)
      }

    } catch (err) {
      debug(err)
      this.safeError(err)
    }
  }
}
