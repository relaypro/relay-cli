// Copyright © 2022 Relay Inc.

import { CreateCommand } from '../../../lib/command.js'
import { string, subscriber, workflowFlags } from '../../../lib/flags/index.js'


import { NewWorkflow } from '../../../lib/api.js'
import { createWorkflow } from '../../../lib/workflow.js'

import debugFn from 'debug'
const debug = debugFn(`workflow:create:call`)

type Direction = `inbound` | `outbound`
type CallType = `on_call_request` | `on_incoming_call`
type CallWorkflow = NewWorkflow & { config: { trigger: { [K in CallType]: `.*` }}}

const types = {
  inbound: `on_incoming_call`,
  outbound: `on_call_request`,
}
const mapType = (type: Direction): CallType => types[type] as CallType

export class CallWorkflowCommand extends CreateCommand {

  static description = `Create or update a workflow triggered by inbound or outbound calling`

  static strict = false

  static flags = {
    ...subscriber,
    ...workflowFlags,
    trigger: string({
      required: true,
      multiple: false,
      default: `outbound`,
      options: [`inbound`, `outbound`],
      description: `Trigger whether an inbound or outbound call is placed`,
    }),
  }

  async run(): Promise<void> {
    const { flags } = await this.parse(CallWorkflowCommand)

    try {
      const workflow: CallWorkflow = await createWorkflow(flags) as CallWorkflow

      if (!flags.trigger) {
        throw new Error(`Trigger type call requires specifying a trigger of inbound or outbound. For instance '--trigger outbound'`)
      } else {
        workflow.config.trigger[mapType(flags.trigger as Direction)] = `.*`
      }

      await this.saveWorkflow(flags[`subscriber-id`], workflow, flags[`dry-run`])

    } catch (err) {
      debug(err)
      this.safeError(err)
    }
  }
}
