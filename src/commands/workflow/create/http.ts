import { Command } from '../../../lib/command'
import { enum as enumFlag, workflowArgs, workflowFlags } from '../../../lib/flags'

// eslint-disable-next-line quotes
import debugFn = require('debug')
import { NewWorkflow } from '../../../lib/api'
import { createWorkflow, printWorkflows } from '../../../lib/workflow'

const debug = debugFn(`workflow:create:http`)

type HttpMethod = `POST`
type HttpWorkflow = NewWorkflow & { config: { trigger: { on_http: HttpMethod }}}

const mapTap = (method: string): HttpMethod => `${method}` as HttpMethod

export class HttpWorkflowCommand extends Command {

  static description = `Create or update a workflow triggered by event emitted by Relay device`

  static strict = false

  static flags = {
    ...workflowFlags,
    trigger: enumFlag({
      required: true,
      multiple: false,
      default: `POST`,
      options: [`POST`,],
      description: `HTTP method to trigger this workflow`,
    }),
  }

  static args = [
    ...workflowArgs
  ]

  async run(): Promise<void> {
    const { flags, argv, raw } = this.parse(HttpWorkflowCommand)

    try {

      const workflow: HttpWorkflow = createWorkflow(flags, argv, raw) as HttpWorkflow

      if (flags.trigger) {
        workflow.config.trigger.on_http = mapTap(flags.trigger)
      } else {
        throw new Error(`Trigger type http requires specifying an HTTP method. For instance '--trigger POST'`)
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
