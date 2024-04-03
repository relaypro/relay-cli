// Copyright © 2022 Relay Inc.

import { ux } from '@oclif/core'

import { isEmpty, keyBy, map } from 'lodash-es'

import { Command } from '../../../lib/command.js'
import * as flags from '../../../lib/flags/index.js'
import { printWorkflowInstances } from '../../../lib/utils.js'
import { MergedWorkflowInstance } from '../../../lib/api.js'

import debugFn from 'debug'
const debug = debugFn(`workflow`)

export default class WorkflowInstances extends Command {
  static description = `List workflow instances`

  static hidden = false

  static enableJsonFlag = true

  static flags = {
    ...flags.subscriber,
    [`include-history`]: flags.boolean({
      char: `H`,
    }),
    ...ux.table.flags(),
  }

  async run(): Promise<Record<string, unknown>> {
    const { flags } = await this.parse(WorkflowInstances)

    let data: MergedWorkflowInstance[] = []

    try {
      const subscriberId = flags[`subscriber-id`]
      const includeHistory = flags[`include-history`]
      const [workflows, instances, historicalInstances] = await Promise.all([
        this.relay.workflows(subscriberId),
        this.relay.workflowInstances(subscriberId),
        includeHistory ? this.relay.historicalWorkflowInstances(subscriberId) : []
      ])

      const keyedWorkflows = keyBy(workflows, `workflow_id`)

      data = map([...instances, ...historicalInstances], instance => ({
        ...instance,
        workflow: keyedWorkflows[instance.workflow_id],
      }))

      if (!this.jsonEnabled()) {
        if (!isEmpty(data)) {

          printWorkflowInstances(data, flags)
        } else {
          this.log(`No workflows instances`)
        }
      }

    } catch (err) {
      debug(err)
      this.safeError(err)
    }

    return { data }
  }
}
