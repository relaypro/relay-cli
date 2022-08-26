// Copyright © 2022 Relay Inc.

import { CreateCommand } from '../../../lib/command'
import { enum as enumFlag, workflowFlags } from '../../../lib/flags'

// eslint-disable-next-line quotes
import debugFn = require('debug')
import { NewWorkflow } from '../../../lib/api'
import { createWorkflow } from '../../../lib/workflow'

const debug = debugFn(`workflow:create:http`)

type HttpMethod = `POST`
type HttpWorkflow = NewWorkflow & { config: { trigger: { on_http: HttpMethod }}}

const mapTap = (method: string): HttpMethod => `${method}` as HttpMethod

export class HttpWorkflowCommand extends CreateCommand {

  static description = `Create or update a workflow triggered by an HTTP request`

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

  async run(): Promise<void> {
    const { flags, raw } = await this.parse(HttpWorkflowCommand)

    try {

      const workflow: HttpWorkflow = await createWorkflow(flags, raw) as HttpWorkflow

      if (flags.trigger) {
        workflow.config.trigger.on_http = mapTap(flags.trigger)
      } else {
        throw new Error(`Trigger type http requires specifying an HTTP method. For instance '--trigger POST'`)
      }

      await this.saveWorkflow(workflow, flags[`dry-run`])

    } catch (err) {
      debug(err)
      this.safeError(err)
    }
  }
}
