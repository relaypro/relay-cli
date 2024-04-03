// Copyright © 2022 Relay Inc.

import { ux } from '@oclif/core'
import confirm from '@inquirer/confirm'
import { filter, isEmpty, every, fill, size, values, zipObject, map } from 'lodash-es'

import { Command } from '../../../lib/command.js'
import * as cliflags from '../../../lib/flags/index.js'

import debugFn from 'debug'
const debug = debugFn(`workflow`)

const runConfirm = async (message: string): Promise<boolean> => {
  return !!(await confirm({ message }))
}

export default class WorkflowInstancesStop extends Command {
  static description = `Stop a running workflow instance`

  static hidden = true

  static flags = {
    ...cliflags.subscriber,
    ...cliflags.workflowInstanceFlags,
    ...cliflags.waitFlags,
    ...cliflags.dryRunFlags,
    ...cliflags.confirmFlags,
  }

  async run(): Promise<void> {
    const { flags } = await this.parse(WorkflowInstancesStop)

    try {
      const confirm = flags[`confirm`]
      const dryRun = flags[`dry-run`]
      const wait = flags[`wait`]
      const subscriberId = flags[`subscriber-id`]
      const instanceId = flags[`instance-id`]
      const workflowId = flags[`workflow-id`]

      const workflows = await this.relay.workflowInstances(subscriberId)

      const instances = map(filter(workflows, ({ instance_id, workflow_id }) => (instanceId === instance_id || workflowId === workflow_id)), `instance_id`)

      debug(`matched instances to stop`, instances)

      if (isEmpty(instances)) {
        ux.log(`No matching workflow instances to stop`)
        return
      }

      if (dryRun) {

        ux.log(`Stop workflow instance(s) dry-run: ${instances.toString()}`)

      } else {

        const didConfirm = confirm ? true : await runConfirm(`Stop workflow instances ${instances.join(`, `)}\nAre you sure?`)

        if (didConfirm) {

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
            ux.action.start(`Waiting for stop confirmation`)

            while(!every(values(waitConfirmation), Boolean)) {
              for (const instanceId of toConfirm) {
                const results = await this.relay.historicalWorkflowInstances(subscriberId, { workflow_instance_id: instanceId })
                if (!isEmpty(results)) {
                  waitConfirmation[instanceId] = results[0]?.status === `terminated`
                }
              }
              await ux.wait(1000)
            }

            ux.action.stop()
          }

          if (!isEmpty(rejected)) {
            ux.styledHeader(`Workflow `)
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
