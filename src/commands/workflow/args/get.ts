import { cli } from 'cli-ux'
import { forEach, isEmpty, reduce, size } from 'lodash'
import { Command } from '../../../lib/command'
import * as flags from '../../../lib/flags'

const debug = require('debug')(`workflow`)

export class UnsetArgsCommand extends Command {

  static strict = false

  static description = `display a single workflow arguments`

  static flags = {
    [`workflow-id`]: flags.workflowId,
  }

  static args = [
    {
      name: `ARG`,
      required: true,
    }
  ]

  async run() {
    const { argv, flags } = this.parse(UnsetArgsCommand)
    const workflowId = flags[`workflow-id`]

    if (argv.length === 0) {
      this.error('Usage: relay workflow:args:get ARG\nMust specify ARG.')
    }

    debug(argv)

    const workflow = await this.relay.workflow(workflowId)
    if (workflow) {

      const unsets: string[] = []
      const args = workflow?.config?.trigger?.start?.workflow?.args
      const mappedArgs = reduce<string, Record<string, any>[]>(argv, (mappedArgs, arg) => {
        const value = args[arg]
        if (value !== undefined) {
          mappedArgs.push({ arg, value, type: typeof value })
        } else {
          unsets.push(arg)
        }
        return mappedArgs
      }, [])

      if (size(argv) !== size(unsets)) {
        cli.styledHeader(`Workflow arguments for ID ${workflowId}`)
        cli.table(mappedArgs, {
          arg: {},
          value: {},
          type: {}
        }, {

        })
      }

      if (!isEmpty(unsets)) {
        cli.styledHeader(`Following arguments are not set on Workflow`)
        forEach(unsets, arg => {
          this.error(`${arg}`)
        })
      }
    } else {
      cli.log(`Workflow ID does not exist: ${workflowId}`)
    }
  }
}
