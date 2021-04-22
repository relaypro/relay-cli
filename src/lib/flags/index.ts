import * as flags from '@oclif/command/lib/flags'
export * from '@oclif/command/lib/flags'

import { subscriberId } from './subscriber'

import { workflowId } from './workflow'
import { booleanValue } from './boolean'
import { numberValue } from './number'

const subscriber = {
  [`subscriber-id`]: subscriberId,
}

export type WorkflowFlags = {
  name: string,
  uri: string,
  transient: boolean,
  hidden: boolean,
  http: boolean,
}

const workflowArgs = [
  {
    name: `ID`,
    description: `device / user ID to install workflow on`,
  },
]

const workflowFlags = {
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
    char: `i`,
    default: false,
    description: `Hide channel from originating device`,
  }),
  http: flags.boolean({
    char: `h`,
    default: false,
    description: `Allow this workflow to be triggered with an HTTP request`,
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
  workflowArgs,
}
