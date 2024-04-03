// Copyright © 2022 Relay Inc.

import { CreateCommand } from '../../../lib/command.js'
import { string, subscriber, workflowFlags } from '../../../lib/flags/index.js'

import { NewWorkflow } from '../../../lib/api.js'
import { createWorkflow } from '../../../lib/workflow.js'

import debugFn from 'debug'
const debug = debugFn(`workflow:create:position`)

type Transition = `entry` | `exit`

type PositionWorkflow = NewWorkflow & { config: { trigger: { on_position: { venue_id: string, position_id: string, transition: Transition } }}}

const mapTransition = (transition: string): Transition => `${transition}` as Transition

export class PositionWorkflowCommand extends CreateCommand {

  static description = `Create or update a workflow triggered by a position transition`

  static hidden = false

  static strict = false

  static flags = {
    ...subscriber,
    ...workflowFlags,
    trigger: string({
      required: true,
      multiple: false,
      default: `entry`,
      options: [`entry`, `exit`] as const,
      description: `Transition trigger for the specified position`,
    }),
    venue_id: string({
      char: `v`,
      required: true,
      multiple: false,
      description: `Venue ID`
    }),
    position_id: string({
      char: `p`,
      required: true,
      multiple: false,
      description: `Position ID`
    }),
  }

  async run(): Promise<void> {
    const { flags } = await this.parse(PositionWorkflowCommand)

    try {

      const workflow: PositionWorkflow = await createWorkflow(flags) as PositionWorkflow
      if (flags.trigger && flags.venue_id && flags.position_id) {
        workflow.config.trigger.on_position = {
          venue_id: flags.venue_id,
          position_id: flags.position_id,
          transition: mapTransition(flags.trigger)
        }
      } else {
        throw new Error(`Trigger type position requires specifying a transition trigger and position ID.`)
      }

      await this.saveWorkflow(flags[`subscriber-id`], workflow, flags[`dry-run`])

    } catch (err) {
      debug(err)
      this.safeError(err)
    }
  }
}
