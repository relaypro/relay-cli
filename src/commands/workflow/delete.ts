import { cli } from 'cli-ux'

import { Command } from '../../lib/command'
import * as flags from '../../lib/flags'

const { Confirm } = require('enquirer')
const debug = require('debug')(`workflow`)

export class DeleteWorkflowCommand extends Command {

  static description = `destructively delete and remove a workflow`

  static flags = {
    [`workflow-id`]: flags.workflowId,
  }

  async run() {
    const { flags } = this.parse(DeleteWorkflowCommand)
    const workflowId = flags[`workflow-id`]

    try {
      const workflow = await this.relay.workflow(workflowId)

      debug(workflow)

      if (workflow) {
        const prompt = new Confirm({
          name: `question`,
          message: `Deleting ${workflow.name} (ID: ${workflowId}). Are you sure?`
        })

        const answer = await prompt.run()

        if (answer) {
          const success = await this.relay.removeWorkflow(workflow.workflow_id)
          if (success) {
            cli.log(`Workflow deleted`)
          } else {
            cli.log(`Workflow NOT deleted`)
          }
        } else {
          cli.log(`Workflow NOT deleted`)
        }

      } else {
        cli.log(`Workflow ID does not exist: ${workflowId}`)
      }

    } catch (err) {
      debug(err)
      this.error(err)
    }
  }
}
