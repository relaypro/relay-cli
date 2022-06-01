import { CliUx } from '@oclif/core'

import isEmpty from 'lodash/isEmpty'
import keyBy from 'lodash/keyBy'
import map from 'lodash/map'

import { Command } from '../../../lib/command'

import * as flags from '../../../lib/flags'

// eslint-disable-next-line quotes
import debugFn = require('debug')
import { printWorkflowInstances } from '../../../lib/utils'

import { MergedWorkflowInstance } from '../../../lib/api'


const debug = debugFn(`workflow`)

export default class WorkflowInstances extends Command {
  static description = `List workflow instances`

  static hidden = true

  static enableJsonFlag = true

  static flags = {
    ...flags.subscriber,
    [`include-history`]: flags.boolean({
      char: `H`,
    }),
    ...CliUx.ux.table.flags(),
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
