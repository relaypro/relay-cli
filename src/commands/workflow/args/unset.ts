import { cli } from 'cli-ux'
import { join, omit } from 'lodash'
import { Command } from '../../../lib/command'
import * as flags from '../../../lib/flags'

const debug = require('debug')(`workflow`)

export class UnsetArgsCommand extends Command {

  static strict = false

  static description = `unset one or more workflow arguments`

  static flags = {
    [`workflow-id`]: flags.workflowId,
  }

  async run() {
    const { argv, flags } = this.parse(UnsetArgsCommand)
    const workflowId = flags[`workflow-id`]

    if (argv.length === 0) {
      this.error('Usage: relay workflow:args:unset KEY1 [KEY2 ...]\nMust specify KEY to unset.')
    }

    debug(argv)

    cli.action.start(`Unsetting args ${join(argv, `, `)} on Workflow ID: ${workflowId}`)

    const workflow = await this.relay.workflow(workflowId)
    if (workflow) {
      debug(`existing args`, workflow.config.trigger.start.workflow.args)
      workflow.config.trigger.start.workflow.args = omit(
        workflow.config.trigger.start.workflow.args,
        argv,
      )
      await this.relay.saveWorkflow(workflow)
      cli.action.stop(`success`)
      cli.styledHeader(`New Workflow arguments`)
      cli.styledJSON(workflow.config.trigger.start.workflow.args)
    } else {
      cli.action.stop(`failed`)
      cli.log(`Workflow ID does not exist: ${workflowId}`)
    }
  }
}
