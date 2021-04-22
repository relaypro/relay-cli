import { cli } from 'cli-ux'
import { join } from 'lodash'
import { Command } from '../../lib/command'
import * as flags from '../../lib/flags'

// eslint-disable-next-line quotes
import debugFn = require('debug')

const debug = debugFn(`workflow`)

export class InstallWorkflowCommand extends Command {

  static description = `Install an existing workflow into one or more devices`

  static flags = {
    [`workflow-id`]: flags.workflowId,
    ...flags.subscriber,
  }

  static args = [
    {
      name: `ID`,
      required: true,
      description: `device / user ID to install workflow on`,
    }
  ]

  async run(): Promise<void> {
    const { flags, argv } = this.parse(InstallWorkflowCommand)
    const workflowId = flags[`workflow-id`]
    const subscriberId = flags[`subscriber-id`]

    try {
      cli.action.start(`Installing Workflow ${workflowId} on ${join(argv, `, `)}`)
      const workflow = await this.relay.workflow(subscriberId, workflowId)

      if (workflow) {
        debug(`existing install`, workflow.install)
        workflow.install = [...workflow.install, ...argv]
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
      if (err.statusCode === 400 && err.body.error === `invalid_install_user_id`) {
        this.error(`One or more of IDs is not valid`)
      } else {
        this.error(err)
      }
    }
  }
}
