import { CreateCommand } from '../../../lib/command'
import { enum as enumFlag, workflowFlags } from '../../../lib/flags'

// eslint-disable-next-line quotes
import debugFn = require('debug')
import { NewWorkflow } from '../../../lib/api'
import { createWorkflow } from '../../../lib/workflow'

const debug = debugFn(`workflow:create:button`)

type TapType = `action_button_single_tap` | `action_button_double_tap`
type ButtonWorkflow = NewWorkflow & { config: { trigger: { on_button: TapType }}}

const mapTap = (tap: string): TapType => `action_button_${tap}_tap` as TapType

export class ButtonWorkflowCommand extends CreateCommand {

  static description = `Create or update a workflow triggered by button taps`

  static strict = false

  static flags = {
    ...workflowFlags,
    trigger: enumFlag({
      required: true,
      multiple: false,
      default: `single`,
      options: [`single`, `double`],
      description: `Number of button taps to trigger this workflow`,
    }),
  }

  async run(): Promise<void> {
    const { flags, raw } = await this.parse(ButtonWorkflowCommand)

    try {

      const workflow: ButtonWorkflow = createWorkflow(flags, raw) as ButtonWorkflow

      if (flags.trigger) {
        workflow.config.trigger.on_button = mapTap(flags.trigger)
      } else {
        throw new Error(`Trigger type button requires specifying number of taps. For instance '--trigger single'`)
      }

      await this.saveWorkflow(workflow, flags[`dry-run`])

    } catch (err) {
      debug(err)
      this.safeError(err)
    }
  }
}
