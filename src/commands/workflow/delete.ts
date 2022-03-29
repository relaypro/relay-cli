import { Command } from '../../lib/command'
import * as flags from '../../lib/flags'
// eslint-disable-next-line quotes
import debugFn = require('debug')

const debug = debugFn(`workflow`)

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Confirm } = require('enquirer') // eslint-disable-line quotes

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
        const prompt = new Confirm({
          name: `question`,
          message: `Deleting ${workflow.name} (ID: ${workflowId}). Are you sure?`
        })

        const answer = await prompt.run()

        if (answer) {
          const success = await this.relay.removeWorkflow(workflow.workflow_id)
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
