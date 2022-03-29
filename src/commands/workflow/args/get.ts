import { CliUx } from '@oclif/core'
import { forEach, isEmpty, reduce, size } from 'lodash'
import { Command } from '../../../lib/command'
import * as flags from '../../../lib/flags'

import { ArgValueType } from '../../../lib/api'

// eslint-disable-next-line quotes
import debugFn = require('debug')
const debug = debugFn(`workflow`)

type ArgType = {
  arg: string,
  value: ArgValueType
  type: `string` | `number` | `boolean`
}

export class UnsetArgsCommand extends Command {

  static strict = false

  static description = `display a single workflow arguments`

  static flags = {
    [`workflow-id`]: flags.workflowId,
    ...flags.subscriber,
  }

  static args = [
    {
      name: `ARG`,
      required: true,
    }
  ]

  async run(): Promise<void> {
    const { argv, flags } = await this.parse(UnsetArgsCommand)
    const workflowId = flags[`workflow-id`]
    const subscriberId = flags[`subscriber-id`]

    if (argv.length === 0) {
      this.error(`Usage: relay workflow:args:get ARG\nMust specify ARG.`)
    }

    debug(argv)

    const workflow = await this.relay.workflow(subscriberId, workflowId)
    if (workflow) {

      const unsets: string[] = []
      const args = workflow?.config?.trigger?.start?.workflow?.args
      const mappedArgs = reduce<string, ArgType[]>(argv, (mappedArgs, arg) => {
        const value = args[arg]
        const type = typeof value
        if (value !== undefined) {
          if (type === `string` || type === `number` || type === `boolean`) {
            mappedArgs.push({ arg, value, type })
          } else {
            throw new Error(`arg ${arg} is of invalid type ${type}`)
          }
        } else {
          unsets.push(arg)
        }
        return mappedArgs
      }, [])

      if (size(argv) !== size(unsets)) {
        CliUx.ux.styledHeader(`Workflow arguments for ID ${workflowId}`)
        CliUx.ux.table(mappedArgs, {
          arg: {},
          value: {},
          type: {}
        }, {

        })
      }

      if (!isEmpty(unsets)) {
        CliUx.ux.styledHeader(`Following arguments are not set on Workflow`)
        forEach(unsets, arg => {
          this.error(`${arg}`)
        })
      }
    } else {
      this.log(`Workflow ID does not exist: ${workflowId}`)
    }
  }
}
