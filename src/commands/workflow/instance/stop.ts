import { CliUx } from '@oclif/core'

import filter from 'lodash/filter'
import isEmpty from 'lodash/isEmpty'
import every from 'lodash/every'
import fill from 'lodash/fill'
import size from 'lodash/size'
import values from 'lodash/values'
import zipObject from 'lodash/zipObject'
import map from 'lodash/map'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Confirm } = require('enquirer') // eslint-disable-line quotes

import { Command } from '../../../lib/command'

import * as cliflags from '../../../lib/flags'

// eslint-disable-next-line quotes
import debugFn = require('debug')

const debug = debugFn(`workflow`)

export default class WorkflowInstancesStop extends Command {
  static description = `Stop a running workflow instance`

  static hidden = true

  static flags = {
    ...cliflags.subscriber,
    ...cliflags.workflowInstanceFlags,
    ...cliflags.waitFlags,
    ...cliflags.dryRunFlags,
  }

  async run(): Promise<void> {
    const { flags } = await this.parse(WorkflowInstancesStop)

    try {
      const dryRun = flags[`dry-run`]
      const wait = flags[`wait`]
      const subscriberId = flags[`subscriber-id`]
      const instanceId = flags[`instance-id`]
      const workflowId = flags[`workflow-id`]

      const workflows = await this.relay.workflowInstances(subscriberId)

      const instances = map(filter(workflows, ({ instance_id, workflow_id }) => (instanceId === instance_id || workflowId === workflow_id)), `instance_id`)

      debug(`matched instances to stop`, instances)

      if (isEmpty(instances)) {
        CliUx.ux.log(`No matching workflow instances to stop`)
        return
      }

      if (dryRun) {

        CliUx.ux.log(`Stop workflow instance(s) dry-run: ${instances.toString()}`)

      } else {

        const prompt = new Confirm({
          name: `question`,
          message: `Stop workflow instances ${instances.join(`, `)}\nAre you sure?`
        })

        const answer = await prompt.run()

        if (answer) {

          const stopAttempts = await Promise.allSettled(map(instances, async (instanceId) => {
            await this.relay.stopWorkflowInstance(subscriberId, instanceId)
            return instanceId
          }))

          debug(`stopAttempts`, stopAttempts)

          const fulfilled = filter(stopAttempts, (stop) => stop.status === `fulfilled`)
          const rejected = filter(stopAttempts, (stop) => stop.status === `rejected`)

          if (wait) {
            const toConfirm = map(fulfilled, `value`)
            const waitConfirmation = zipObject(toConfirm, fill(Array(size(toConfirm)), false))
            CliUx.ux.action.start(`Waiting for stop confirmation`)

            while(!every(values(waitConfirmation), Boolean)) {
              for (const instanceId of toConfirm) {
                const results = await this.relay.historicalWorkflowInstances(subscriberId, { workflow_instance_id: instanceId })
                if (!isEmpty(results)) {
                  waitConfirmation[instanceId] = results[0]?.status === `terminated`
                }
              }
              await CliUx.ux.wait(1000)
            }

            CliUx.ux.action.stop()
          }

          if (!isEmpty(rejected)) {
            CliUx.ux.styledHeader(`Workflow `)
          }

        } else {
          this.log(`Workflow instances NOT stopped`)
        }

      }

    } catch (err) {
      debug(err)
      this.safeError(err)
    }
  }
}
