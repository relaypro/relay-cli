// Copyright © 2022 Relay Inc.

import { CreateCommand } from '../../../lib/command.js'
import { string, integer, subscriber, workflowFlags } from '../../../lib/flags/index.js'

import debugFn from 'debug'
import { NewWorkflow } from '../../../lib/api.js'
import { createWorkflow } from '../../../lib/workflow.js'

const debug = debugFn(`workflow:create:battery`)

type BatteryType = `on_battery_discharge` | `on_battery_charge`
type BatteryWorkflow = NewWorkflow & { config: { trigger: { [K in BatteryType]: number }}}

const mapTap = (tap: string): BatteryType => `on_battery_${tap}` as BatteryType

export class BatteryWorkflowCommand extends CreateCommand {

  static description = `Create or update a workflow triggered by crossing a charging or discharging threshold of any device on the account`

  static strict = false

  static flags = {
    ...subscriber,
    ...workflowFlags,
    trigger: string({
      required: true,
      multiple: false,
      default: `discharge`,
      options: [`charge`, `discharge`],
      description: `Trigger whether threshold value is reached when charging or discharging`,
    }),
    threshold: integer({
      required: true,
      multiple: false,
      default: 25,
      description: `Threshold percentage as an integer to trigger workflow`,
    }),
  }

  async run(): Promise<void> {
    const { flags } = await this.parse(BatteryWorkflowCommand)

    try {

      const workflow: BatteryWorkflow = await createWorkflow(flags) as BatteryWorkflow

      if (!flags.trigger) {
        throw new Error(`Trigger type battery requires specifying a trigger of charge or discharge. For instance '--trigger discharge'`)
      } else if (!(flags.threshold > 0)) {
        throw new Error(`Trigger type battery requires specifying a threshold percentage as an integer. For instance '--threshold 25'`)
      } else {
        workflow.config.trigger[mapTap(flags.trigger)] = flags.threshold
      }

      await this.saveWorkflow(flags[`subscriber-id`], workflow, flags[`dry-run`])

    } catch (err) {
      debug(err)
      this.safeError(err)
    }
  }
}
