// Copyright © 2022 Relay Inc.

import { CreateCommand } from '../../../lib/command'
import { string, workflowFlags } from '../../../lib/flags'

// eslint-disable-next-line quotes
import debugFn = require('debug')
import { NewWorkflow } from '../../../lib/api'
import { createWorkflow } from '../../../lib/workflow'

const debug = debugFn(`workflow:create:geofence`)

type Transition = `enter` | `exit`

type GeofenceWorkflow = NewWorkflow & { config: { trigger: { on_geofence: { geofence_id: string, transition: Transition } }}}

const mapTransition = (transition: string): Transition => `${transition}` as Transition

export class GeofenceWorkflowCommand extends CreateCommand {

  static description = `Create or update a workflow triggered by geofence transition`

  static hidden = true

  static strict = false

  static flags = {
    ...workflowFlags,
    trigger: string({
      required: true,
      multiple: false,
      default: `enter`,
      options: [`enter`, `exit`],
      description: `Transition trigger for the specified geofence`,
    }),
    id: string({
      required: true,
      multiple: false,
      description: `Geofence ID`
    })
  }

  async run(): Promise<void> {
    const { flags, raw } = await this.parse(GeofenceWorkflowCommand)

    try {

      const workflow: GeofenceWorkflow = createWorkflow(flags, raw) as GeofenceWorkflow

      if (flags.trigger && flags.id) {
        workflow.config.trigger.on_geofence = {
          transition: mapTransition(flags.trigger),
          geofence_id: flags.id,
        }
      } else {
        throw new Error(`Trigger type geofence requires specifying a trigger and geofence ID.`)
      }

      await this.saveWorkflow(workflow, flags[`dry-run`])

    } catch (err) {
      debug(err)
      this.safeError(err)
    }
  }
}
