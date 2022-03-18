import { CreateCommand } from '../../../lib/command'
import { enum as enumFlag, workflowFlags } from '../../../lib/flags'

// eslint-disable-next-line quotes
import debugFn = require('debug')
import { NewWorkflow } from '../../../lib/api'
import { createWorkflow } from '../../../lib/workflow'

const debug = debugFn(`workflow:create:event`)

type EventType = `emergency`
type EventWorkflow = NewWorkflow & { config: { trigger: { on_device_event: EventType }}}

const mapTap = (event: string): EventType => `${event}` as EventType

export class EventWorkflowCommand extends CreateCommand {

  static description = `Create or update a workflow triggered by event emitted by Relay device`

  static strict = false

  static flags = {
    ...workflowFlags,
    trigger: enumFlag({
      required: true,
      multiple: false,
      default: `emergency`,
      options: [`emergency`,],
      description: `Relay device event to trigger this workflow`,
    }),
  }

  async run(): Promise<void> {
    const { flags, raw } = this.parse(EventWorkflowCommand)

    try {

      const workflow: EventWorkflow = createWorkflow(flags, raw) as EventWorkflow

      if (flags.trigger) {
        workflow.config.trigger.on_device_event = mapTap(flags.trigger)
      } else {
        throw new Error(`Trigger type event requires specifying a device event. For instance '--trigger emergency'`)
      }

      await this.saveWorkflow(workflow, flags[`dry-run`])

    } catch (err) {
      debug(err)
      this.error(err)
    }
  }
}
