// Copyright © 2022 Relay Inc.

import { Flags } from '@oclif/core'
export * from '@oclif/core/lib/flags'

import { subscriberId } from './subscriber'
import { workflowId } from './workflow'
import { booleanValue } from './boolean'
import { numberValue, coordinate } from './number'
import { flags } from '@oclif/core/lib/parser'
export { timerFlags, TimerOptions, TimerWorkflow } from './timer'

const subscriber = {
  [`subscriber-id`]: subscriberId,
}

export type WorkflowFlags = {
  install?: string[],
  [`install-all`]?: boolean,
  [`install-group`]?: string,
  absorb?: string[],
  name: string,
  uri: string,
  transient: boolean,
  hidden: boolean,
}

export type ScheduledTaskFlags = {
  frequency?: string,
  count?: number,
  until?: string,
}

export type TaskTypeFlags = {
  key: string | undefined
}

export type UpdateFlags = Omit<TaskTypeFlags, `name` | `source`>

export type AliceStartFlags = {
  install?: string[],
  [`install-all`]?: boolean,
  [`install-group`]?: string,
  name: string,
  tag: string[] | undefined,
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

export type TagFlags = {
  type: `custom`|`user_profile`,
  category: string,
   label: string,
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
    exclusive: [`install-all`, `install-group`],
  }),
  [`install-all`]: Flags.boolean({
    char: `A`,
    default: false,
    allowNo: false,
    description: `Enable rule to install workflow on all device and users on the account`,
    exclusive: [`install`, `install-group`],
  }),
  [`install-group`]: Flags.string({
    char: `G`,
    multiple: false,
    required: false,
    description: `Enable rule to install workflow on a group of device and users`,
    exclusive: [`install`, `install-all`],
  })
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

const apiFlags = {
  cache: Flags.string({
    description: `Cache the response, e.g. "3600s", "60m", "1h"`,
    required: false,
    multiple: false,
  }),
  header: Flags.string({
    char: `H`,
    description: `Add a HTTP request header in key=value format`,
    required: false,
    multiple: true,
  }),
  include: Flags.boolean({
    char: `i`,
    description: `Include HTTP response status line and headers in the output`,
    default: false,
    allowNo: true,
  }),
  input: Flags.string({
    description: `The file to use as body for the HTTP request`,
    required: false,
    multiple: false,
  }),
  // jq: Flags.string({
  //   char: `q`,
  //   description: `Query to select values from the response using jq syntax`
  // }),
  method: Flags.enum({
    char: `X`,
    description: `The HTTP method for the request`,
    default: `GET`,
    options: [`GET`,`POST`,`PUT`,`DELETE`],
    required: false,
    multiple: false,
  }),
}

const tagFlags = {
  type: Flags.enum({
    char: `t`,
    hidden: true,
    description: `Sets the tag to profile or custom type`,
    options: [`user_profile`, `custom`],
    default: `custom`,
    multiple: false,
    required: true,
  }),
  category: Flags.string({
    char: `c`,
    description: `Sets the custom category; useful to group like tags in the same category`,
    multiple: false,
    required: true,
  }),
  label: Flags.string({
    char: `l`,
    description: `Sets the tag label; useful to differentiate individual tags`,
    multiple: false,
    required: true,
  }),
  arg: Flags.string({
    char: `a`,
    hidden: true,
    multiple: true,
    required: false,
    description: `A content string name/value pair that can be used in the workflow trigger match and in the workflow START event`,
    helpValue: `"category=task"`,
  })
}

const pagingFlags = {
  oldest: flags.string({
    required: false,
    multiple: false,
    description: `timestamp of the oldest event to return`
  }),
  latest: flags.string({
    required: false,
    multiple: false,
    description: `timestamp of the latest event to return`
  }),
  cursor: flags.string({
    required: false,
    multiple: false,
    description: `string returned from a previous query; useful to page through data`
  }),
  limit: flags.integer({
    required: false,
    multiple: false,
    description: `maximum number of events to return; 100 if not specified`
  }),
}

export {
  pagingFlags,
  apiFlags,
  tagFlags,
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
  coordinate,
}
