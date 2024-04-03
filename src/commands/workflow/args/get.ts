// Copyright © 2022 Relay Inc.

import { Args, ux } from '@oclif/core'
import {
  forEach,
  isEmpty,
  reduce,
  size
} from 'lodash-es'
import { Command } from '../../../lib/command.js'
import * as flags from '../../../lib/flags/index.js'

import { ArgValueType } from '../../../lib/api.js'

import debugFn from 'debug'
const debug = debugFn(`workflow`)

type ArgType = {
  arg: string,
  value: ArgValueType
  type: `string` | `number` | `boolean`
}

export class GetArgsCommand extends Command {

  static strict = false

  static description = `display arguments for a workflow`

  static flags = {
    [`workflow-id`]: flags.workflowId,
    ...flags.subscriber,
  }

  static args = {
    ARG: Args.string({
      name: `ARG`,
      required: true,
    })
  }

  async run(): Promise<void> {
    const { flags, argv } = await this.parse(GetArgsCommand)
    const _argv = argv as string[]
    const workflowId = flags[`workflow-id`]
    const subscriberId = flags[`subscriber-id`]

    if (_argv.length === 0) {
      this.error(`Usage: relay workflow:args:get ARG\nMust specify ARG.`)
    }

    debug(_argv)

    const workflow = await this.relay.workflow(subscriberId, workflowId)
    if (workflow) {

      const unsets: string[] = []
      const args = workflow?.config?.trigger?.start?.workflow?.args
      const mappedArgs = reduce<string, ArgType[]>(_argv, (mappedArgs, arg) => {
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
        ux.styledHeader(`Workflow arguments for ID ${workflowId}`)
        ux.table(mappedArgs, {
          arg: {},
          value: {},
          type: {}
        }, {})
      }

      if (!isEmpty(unsets)) {
        ux.styledHeader(`Following arguments are not set on Workflow`)
        forEach(unsets, arg => {
          this.error(`${arg}`)
        })
      }
    } else {
      this.log(`Workflow ID does not exist: ${workflowId}`)
    }
  }
}
