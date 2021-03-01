import { cli } from 'cli-ux'
import { map } from 'lodash'
import { Command } from '../../../lib/command'
import * as flags from '../../../lib/flags'

const debug = require('debug')(`workflow`)

export class SetArgsCommand extends Command {

  static description = `list a workflow's args`

  static flags = {
    [`workflow-id`]: flags.workflowId,
  }

  async run() {
    const { flags } = this.parse(SetArgsCommand)
    const workflowId = flags[`workflow-id`]

    try {
      const workflow = await this.relay.workflow(workflowId)

      if (workflow) {
        cli.styledHeader(`Workflow arguments for ID ${workflowId}`)
        const args = workflow?.config?.trigger?.start?.workflow?.args||{}
        const mappedArgs = map(args, (value, arg) => ({ arg, value, type: typeof value }))
        cli.table(mappedArgs, {
          arg: {},
          value: {},
          type: {}
        }, {

        })
      } else {
        cli.log(`Workflow ID does not exist: ${workflowId}`)
      }

    } catch (err) {
      debug(err)
      this.error(err)
    }
  }
}
