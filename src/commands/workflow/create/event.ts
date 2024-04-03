// Copyright © 2022 Relay Inc.

import { CreateCommand } from '../../../lib/command.js'
import { string, subscriber, workflowFlags } from '../../../lib/flags/index.js'

import { NewWorkflow } from '../../../lib/api.js'
import { createWorkflow } from '../../../lib/workflow.js'

import debugFn from 'debug'
const debug = debugFn(`workflow:create:event`)

type EventType = `emergency`
type EventWorkflow = NewWorkflow & { config: { trigger: { on_device_event: EventType }}}

const mapTap = (event: string): EventType => `${event}` as EventType

export class EventWorkflowCommand extends CreateCommand {

  static description = `Create or update a workflow triggered by event emitted by Relay device`

  static strict = false

  static flags = {
    ...subscriber,
    ...workflowFlags,
    trigger: string({
      required: true,
      multiple: false,
      default: `emergency`,
      options: [`emergency`,],
      description: `Relay device event to trigger this workflow`,
    }),
  }

  async run(): Promise<void> {
    const { flags } = await this.parse(EventWorkflowCommand)

    try {

      const workflow: EventWorkflow = await createWorkflow(flags) as EventWorkflow

      if (flags.trigger) {
        workflow.config.trigger.on_device_event = mapTap(flags.trigger)
      } else {
        throw new Error(`Trigger type event requires specifying a device event. For instance '--trigger emergency'`)
      }

      await this.saveWorkflow(flags[`subscriber-id`], workflow, flags[`dry-run`])

    } catch (err) {
      debug(err)
      this.safeError(err)
    }
  }
}
