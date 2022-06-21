// Copyright © 2022 Relay Inc.

import { CreateCommand } from '../../../lib/command'
import { enum as enumFlag, integer, workflowFlags } from '../../../lib/flags'

// eslint-disable-next-line quotes
import debugFn = require('debug')
import { NewWorkflow } from '../../../lib/api'
import { createWorkflow } from '../../../lib/workflow'

const debug = debugFn(`workflow:create:battery`)

type BatteryType = `on_battery_discharge` | `on_battery_charge`
type BatteryWorkflow = NewWorkflow & { config: { trigger: { [K in BatteryType]: number }}}

const mapTap = (tap: string): BatteryType => `on_battery_${tap}` as BatteryType

export class BatteryWorkflowCommand extends CreateCommand {

  static description = `Create or update a workflow triggered by crossing a charging or discharging threshold of any device on the account`

  static strict = false

  static flags = {
    ...workflowFlags,
    trigger: enumFlag({
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
    const { flags, raw } = await this.parse(BatteryWorkflowCommand)

    try {

      const workflow: BatteryWorkflow = createWorkflow(flags, raw) as BatteryWorkflow

      if (!flags.trigger) {
        throw new Error(`Trigger type battery requires specifying a trigger of charge or discharge. For instance '--trigger discharge'`)
      } else if (!(flags.threshold > 0)) {
        throw new Error(`Trigger type battery requires specifying a threshold percentage as an integer. For instance '--threshold 25'`)
      } else {
        workflow.config.trigger[mapTap(flags.trigger)] = flags.threshold
      }

      await this.saveWorkflow(workflow, flags[`dry-run`])

    } catch (err) {
      debug(err)
      this.safeError(err)
    }
  }
}
