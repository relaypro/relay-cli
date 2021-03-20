import { cli } from 'cli-ux'
import { filter, includes, join } from 'lodash'
import { Command } from '../../lib/command'
import * as flags from '../../lib/flags'

// eslint-disable-next-line quotes
import debugFn = require('debug')

const debug = debugFn(`workflow`)

export class UninstallWorkflowCommand extends Command {

  static description = `uninstall an existing workflow from one or more devices`

  static flags = {
    [`workflow-id`]: flags.workflowId,
    ...flags.subscriber,
  }

  static args = [
    {
      name: `ID`,
      required: true,
      description: `device / user ID to uninstall workflow on`,
    }
  ]

  async run(): Promise<void> {
    const { flags, argv } = this.parse(UninstallWorkflowCommand)
    const workflowId = flags[`workflow-id`]
    const subscriberId = flags[`subscriber-id`]

    try {
      cli.action.start(`Uninstalling Workflow ${workflowId} on ${join(argv, `, `)}`)
      const workflow = await this.relay.workflow(subscriberId, workflowId)

      if (workflow) {
        debug(`existing install`, workflow.install)
        workflow.install = filter(workflow.install, i => !includes(argv, i))
        await this.relay.saveWorkflow(workflow)
        cli.action.stop(`success`)
        cli.styledHeader(`Workflow now installed on`)
        cli.styledJSON(workflow.install)
      } else {
        cli.action.stop(`failed`)
        cli.log(`Workflow ID does not exist: ${workflowId}`)
      }
    } catch (err) {
      debug(err)
      this.error(err)
    }
  }
}
