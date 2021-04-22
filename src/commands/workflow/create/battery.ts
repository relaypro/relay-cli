import { Command } from '../../../lib/command'
import { enum as enumFlag, integer, workflowArgs, workflowFlags } from '../../../lib/flags'

// eslint-disable-next-line quotes
import debugFn = require('debug')
import { NewWorkflow } from '../../../lib/api'
import { createWorkflow, printWorkflows } from '../../../lib/workflow'

const debug = debugFn(`workflow:create:battery`)

type BatteryType = `on_battery_discharge` | `on_battery_charge`
type BatteryWorkflow = NewWorkflow & { config: { trigger: { [K in BatteryType]: number }}}

const mapTap = (tap: string): BatteryType => `on_battery_${tap}` as BatteryType

export class BatteryWorkflowCommand extends Command {

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

  static args = [
    ...workflowArgs
  ]

  async run(): Promise<void> {
    const { flags, argv, raw } = this.parse(BatteryWorkflowCommand)

    try {

      const workflow: BatteryWorkflow = createWorkflow(flags, argv, raw) as BatteryWorkflow

      if (!flags.trigger) {
        throw new Error(`Trigger type battery requires specifying a trigger of charge or discharge. For instance '--trigger discharge'`)
      } else if (!(flags.threshold > 0)) {
        throw new Error(`Trigger type battery requires specifying a threshold percentage as an integer. For instance '--threshold 25'`)
      } else {
        workflow.config.trigger[mapTap(flags.trigger)] = flags.threshold
      }

      debug(workflow)

      const workflows = await this.relay.saveWorkflow(workflow)

      printWorkflows(workflows)

    } catch (err) {
      debug(err)
      this.error(err)
    }
  }
}
