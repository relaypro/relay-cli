// Copyright © 2022 Relay Inc.

import { CreateCommand } from '../../../lib/command'
import { string, workflowFlags } from '../../../lib/flags'

// eslint-disable-next-line quotes
import debugFn = require('debug')
import { NewWorkflow } from '../../../lib/api'
import { createWorkflow } from '../../../lib/workflow'

const debug = debugFn(`workflow:create:position`)

type Transition = `entry` | `exit`

type PositionWorkflow = NewWorkflow & { config: { trigger: { on_position: { position_id: string, transition: Transition } }}}

const mapTransition = (transition: string): Transition => `${transition}` as Transition

export class PositionWorkflowCommand extends CreateCommand {

  static description = `Create or update a workflow triggered by a position transition`

  static hidden = false

  static strict = false

  static flags = {
    ...workflowFlags,
    trigger: string({
      required: true,
      multiple: false,
      default: `entry`,
      options: [`entry`, `exit`],
      description: `Transition trigger for the specified position`,
    }),
    id: string({
      required: true,
      multiple: false,
      description: `Position ID`
    }),
  }

  async run(): Promise<void> {
    const { flags, raw } = await this.parse(PositionWorkflowCommand)

    try {

      const workflow: PositionWorkflow = await createWorkflow(flags, raw) as PositionWorkflow

      if (flags.trigger && flags.id) {
        workflow.config.trigger.on_position = {
          transition: mapTransition(flags.trigger),
          position_id: flags.id,
        }
      } else {
        throw new Error(`Trigger type position requires specifying a transition trigger and position ID.`)
      }

      await this.saveWorkflow(workflow, flags[`dry-run`])

    } catch (err) {
      debug(err)
      this.safeError(err)
    }
  }
}
