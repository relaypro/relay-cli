// Copyright © 2022 Relay Inc.

import confirm from '@inquirer/confirm'

import { Command } from '../../lib/command.js'
import * as flags from '../../lib/flags/index.js'

import debugFn from 'debug'
const debug = debugFn(`workflow`)

export class DeleteWorkflowCommand extends Command {

  static description = `Destructively delete and remove a workflow`

  static flags = {
    [`workflow-id`]: flags.workflowId,
    ...flags.subscriber,
  }

  async run(): Promise<void> {
    const { flags } = await this.parse(DeleteWorkflowCommand)
    const workflowId = flags[`workflow-id`]
    const subscriberId = flags[`subscriber-id`]

    try {
      const workflow = await this.relay.workflow(subscriberId, workflowId)

      debug(workflow)

      if (workflow) {
        const answer = await confirm({
          message: `Deleting ${workflow.name} (ID: ${workflowId}). Are you sure?`
        })

        if (answer) {
          const success = await this.relay.removeWorkflow(subscriberId, workflow.workflow_id)
          if (success) {
            this.log(`Workflow deleted`)
          } else {
            this.log(`Workflow NOT deleted`)
          }
        } else {
          this.log(`Workflow NOT deleted`)
        }

      } else {
        this.log(`Workflow ID does not exist: ${workflowId}`)
      }

    } catch (err) {
      debug(err)
      this.safeError(err)
    }
  }
}
