import * as flags from '@oclif/command/lib/flags'
export * from '@oclif/command/lib/flags'

import { subscriberId } from './subscriber'
import { workflowId } from './workflow'
import { booleanValue } from './boolean'
import { numberValue } from './number'
export { timerFlags, TimerOptions, TimerWorkflow } from './timer'

const subscriber = {
  [`subscriber-id`]: subscriberId,
}

export type WorkflowFlags = {
  install?: string[],
  absorb?: string[],
  name: string,
  uri: string,
  transient: boolean,
  hidden: boolean,
  http: boolean,
}

export type TimerFlags = WorkflowFlags & {
  trigger: string,
  timezone: string,
  start?: string,
  until?: string,
  count?: number,
  frequency?: string,
  interval?: number
}

const workflowFlags = {
  install: flags.string({
    char: `i`,
    multiple: true,
    required: false,
    description: `device / user ID to install workflow on`
  }),
  name: flags.string({
    char: `n`,
    multiple: false,
    required: true,
    description: `Name of the workflow`
  }),
  uri: flags.string({
    char: `u`,
    multiple: false,
    required: true,
    description: `WebSocket URI workflow can be accessed`
  }),
  transient: flags.boolean({
    char: `t`,
    default: true,
    allowNo: true,
    description: `Allow workflow to run in the background; otherwise terminate workflow`,
  }),
  hidden: flags.boolean({
    char: `e`,
    default: false,
    description: `Hide channel from originating device`,
  }),
  http: flags.boolean({
    char: `h`,
    default: false,
    description: `Allow this workflow to be triggered with an HTTP request`,
  }),
  absorb: flags.string({
    required: false,
    multiple: true,
    options: [`on_call_request`, `on_incoming_call`],
    description: `If matching workflow is already running, absorb and deliver specified triggering events as in-workflow events instead`,
    hidden: true,
  }),
  arg: flags.string({
    char: `a`,
    multiple: true,
    required: false,
    description: `String name/value pair workflow arg`,
  }),
  boolean: booleanValue(),
  number: numberValue(),
}

export {
  subscriberId,
  workflowId,
  booleanValue,
  numberValue,
  subscriber,
  workflowFlags,
}
