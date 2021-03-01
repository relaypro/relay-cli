import { cli } from 'cli-ux'
import { filter, includes, join } from 'lodash'
import { Command } from '../../lib/command'
import * as flags from '../../lib/flags'

const debug = require('debug')(`workflow`)

export class UninstallWorkflowCommand extends Command {

  static description = `uninstall an existing workflow from one or more devices`

  static flags = {
    [`workflow-id`]: flags.workflowId,
  }

  static args = [
    {
      name: `ID`,
      required: true,
      description: `device / user ID to uninstall workflow on`,
    }
  ]

  async run() {
    const { flags, argv } = this.parse(UninstallWorkflowCommand)

    const workflowId = flags[`workflow-id`]

    try {
      cli.action.start(`Uninstalling Workflow ${workflowId} on ${join(argv, `, `)}`)
      const workflow = await this.relay.workflow(workflowId)

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
