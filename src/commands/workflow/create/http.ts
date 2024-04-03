// Copyright © 2022 Relay Inc.

import { CreateCommand } from '../../../lib/command.js'
import { string, subscriber, workflowFlags } from '../../../lib/flags/index.js'

import { NewWorkflow } from '../../../lib/api.js'
import { createWorkflow } from '../../../lib/workflow.js'

import debugFn from 'debug'
const debug = debugFn(`workflow:create:http`)

type HttpMethod = `POST`
type HttpWorkflow = NewWorkflow & { config: { trigger: { on_http: HttpMethod }}}

const mapTap = (method: string): HttpMethod => `${method}` as HttpMethod

export class HttpWorkflowCommand extends CreateCommand {

  static description = `Create or update a workflow triggered by an HTTP request`

  // TODO: fix all strict cases that are no longer necessary
  static strict = false

  static flags = {
    ...subscriber,
    ...workflowFlags,
    trigger: string({
      required: true,
      multiple: false,
      default: `POST`,
      options: [`POST`,],
      description: `HTTP method to trigger this workflow`,
    }),
  }

  async run(): Promise<void> {
    const { flags } = await this.parse(HttpWorkflowCommand)

    try {

      const workflow: HttpWorkflow = await createWorkflow(flags) as HttpWorkflow

      if (flags.trigger) {
        workflow.config.trigger.on_http = mapTap(flags.trigger)
      } else {
        throw new Error(`Trigger type http requires specifying an HTTP method. For instance '--trigger POST'`)
      }

      await this.saveWorkflow(flags[`subscriber-id`], workflow, flags[`dry-run`])

    } catch (err) {
      debug(err)
      this.safeError(err)
    }
  }
}
