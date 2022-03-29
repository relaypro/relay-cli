import { CreateCommand } from '../../../lib/command'
import { enum as enumFlag, workflowFlags } from '../../../lib/flags'

// eslint-disable-next-line quotes
import debugFn = require('debug')
import { NewWorkflow } from '../../../lib/api'
import { createWorkflow } from '../../../lib/workflow'

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
    ...workflowFlags,
    trigger: enumFlag({
      required: true,
      multiple: false,
      default: `outbound`,
      options: [`inbound`, `outbound`],
      description: `Trigger whether an inbound or outbound call is placed`,
    }),
  }

  async run(): Promise<void> {
    const { flags, raw } = await this.parse(CallWorkflowCommand)

    try {

      const workflow: CallWorkflow = createWorkflow(flags, raw) as CallWorkflow

      if (!flags.trigger) {
        throw new Error(`Trigger type call requires specifying a trigger of inbound or outbound. For instance '--trigger outbound'`)
      } else {
        workflow.config.trigger[mapType(flags.trigger as Direction)] = `.*`
      }

      await this.saveWorkflow(workflow, flags[`dry-run`])

    } catch (err) {
      debug(err)
      this.safeError(err)
    }
  }
}
