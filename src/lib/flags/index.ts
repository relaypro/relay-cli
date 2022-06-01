import { Flags } from '@oclif/core'
export * from '@oclif/core/lib/flags'

import { subscriberId } from './subscriber'
import { workflowId } from './workflow'
import { booleanValue } from './boolean'
import { numberValue } from './number'
export { timerFlags, TimerOptions, TimerWorkflow } from './timer'

const subscriber = {
  [`subscriber-id`]: subscriberId,
}

export type WorkflowFlags = {
  [`install-all`]?: boolean,
  install?: string[],
  absorb?: string[],
  name: string,
  uri: string,
  transient: boolean,
  hidden: boolean,
}

export type TimerFlags = WorkflowFlags & {
  trigger: string,
  timezone: string,
  start?: string,
  until?: string,
  count?: number,
  frequency?: string,
  interval?: number,
  day?: string[],
}

const dryRunFlags = {
  [`dry-run`]: Flags.boolean({
    char: `N`,
    default: false,
    allowNo: false,
  }),
}

const installFlags = {
  ...dryRunFlags,
  install: Flags.string({
    char: `i`,
    multiple: true,
    required: false,
    description: `device / user ID to install workflow on`,
    exclusive: [`install-all`],
  }),
  [`install-all`]: Flags.boolean({
    char: `A`,
    default: false,
    allowNo: false,
    description: `Enable rule to install workflow on all device and users on the account`,
    exclusive: [`install`],
  }),
}

const workflowFlags = {
  ...dryRunFlags,
  ...installFlags,
  name: Flags.string({
    char: `n`,
    multiple: false,
    required: true,
    description: `Name of the workflow`
  }),
  uri: Flags.string({
    char: `u`,
    multiple: false,
    required: true,
    description: `WebSocket URI workflow can be accessed`
  }),
  transient: Flags.boolean({
    char: `t`,
    default: true,
    allowNo: true,
    description: `Allow workflow to run in the background; otherwise terminate workflow`,
  }),
  hidden: Flags.boolean({
    char: `e`,
    default: false,
    description: `Hide channel from originating device`,
  }),
  absorb: Flags.string({
    required: false,
    multiple: true,
    options: [`on_call_request`, `on_incoming_call`],
    description: `If matching workflow is already running, absorb and deliver specified triggering events as in-workflow events instead`,
    hidden: true,
  }),
  arg: Flags.string({
    char: `a`,
    multiple: true,
    required: false,
    description: `String name/value pair workflow arg`,
  }),
  boolean: booleanValue(),
  number: numberValue(),
}

const waitFlags = {
  [`wait`]: Flags.boolean({
    char: `W`,
    default: true,
    required: false,
    allowNo: true,
    description: `Wait until workflow instance(s) are completely stopped`
  }),
}

const confirmFlags = {
  [`confirm`]: Flags.boolean({
    char: `C`,
    default: false,
    required: false,
    allowNo: true,
    description: `Skip confirmation prompt`
  }),
}

const workflowInstanceFlags = {
  [`instance-id`]: Flags.string({
    char: `i`,
    description: `workflow instance id to stop`,
    required: false,
    hidden: false,
    multiple: false,
    env: `RELAY_WORKFLOW_INSTANCE_ID`,
    exactlyOne: [`workflow-id`, `instance-id`],
  }),
  [`workflow-id`]: Flags.string({
    char: `w`,
    description: `workflow id to stop; will stop all instances`,
    required: false,
    hidden: false,
    multiple: false,
    env: `RELAY_WORKFLOW_ID`,
    exclusive: [`instance-id`],
    exactlyOne: [`workflow-id`, `instance-id`],
  }),
}

export {
  confirmFlags,
  dryRunFlags,
  subscriberId,
  workflowId,
  booleanValue,
  numberValue,
  subscriber,
  workflowFlags,
  workflowInstanceFlags,
  waitFlags,
  installFlags,
}
