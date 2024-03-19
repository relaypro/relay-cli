// Copyright © 2022 Relay Inc.

// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/no-explicit-any */
import { CliUx } from '@oclif/core'
import { filter, join, keys, reduce } from 'lodash'
import { Command } from '../../../lib/command'
import * as flags from '../../../lib/flags'

import { parseArg } from '../../../lib/utils'

// eslint-disable-next-line quotes
import debugFn = require('debug')
const debug = debugFn(`workflow`)

export class SetArgsCommand extends Command {

  static strict = false

  static description = `set one or more workflow arguments`

  static flags = {
    [`workflow-id`]: flags.workflowId,
    arg: flags.string({
      char: `a`,
      multiple: true,
      required: false,
      description: `String name/value pair workflow arg`,
    }),
    boolean: flags.booleanValue(),
    number: flags.numberValue(),
    ...flags.subscriber,
  }

  async run(): Promise<void> {
    const parsed = await this.parse(SetArgsCommand)
    const { flags,  raw } = parsed
    const workflowId = flags[`workflow-id`]
    const subscriberId = flags[`subscriber-id`]

    try {
      const normalArgFlags = filter(raw, ({ flag }: any) => `arg` === flag)
      const normalArgs = reduce(normalArgFlags, (args: Record<string, any>, flag) => {
        const [success, name, value] = parseArg(flag.input)
        if (!success) {
          this.error(`${flag.input} is invalid. Must be in the format of 'foo=bar'`)
        }
        args[name] = value
        return args
      }, {})

      const booleanFlags = filter(raw, ({ flag }: any) => `boolean` === flag)
      debug(`booleanFlags`, booleanFlags)
      let booleanArgs = {}
      for (const flag of booleanFlags)  {
        const nameValue = await SetArgsCommand.flags.boolean.parse(flag.input, null, flag)
        booleanArgs = { ...booleanArgs, ...nameValue }
      }

      const numberFlags = filter(raw, ({ flag }: any) => `number` === flag)
      debug(`numberFlags`, numberFlags)
      let numberArgs = {}
      for (const flag of numberFlags)  {
        const nameValue = await SetArgsCommand.flags.number.parse(flag.input, null, flag)
        numberArgs = { ...numberArgs, ...nameValue }
      }

      const args = { ...normalArgs, ...booleanArgs, ...numberArgs }

      debug(`args`, args)

      CliUx.ux.action.start(`Setting args ${join(keys(args), `, `)} on Workflow ID: ${workflowId}`)

      const workflow = await this.relay.workflow(subscriberId, workflowId)

      if (workflow) {
        debug(`existing args`, workflow.config.trigger.start.workflow.args)
        workflow.config.trigger.start.workflow.args = {
          ...workflow.config.trigger.start.workflow.args,
          ...args,
        }
        await this.relay.saveWorkflow(subscriberId, workflow)
        CliUx.ux.action.stop(`success`)
        CliUx.ux.styledHeader(`New Workflow arguments`)
        CliUx.ux.styledJSON(workflow.config.trigger.start.workflow.args)
      } else {
        CliUx.ux.action.stop(`failed`)
        this.log(`Workflow ID does not exist: ${workflowId}`)
      }

    } catch (err) {
      debug(err)
      this.safeError(err)
    }
  }
}
