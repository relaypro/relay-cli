// Copyright © 2022 Relay Inc.

import { Flags } from '@oclif/core'

import { NewWorkflow } from '../api.js'
import { getTimestampNextHour } from '../datetime.js'

export type TimerOptions = {
  timezone?: string,
  start_time?: string,
  until?: string,
  frequency?: string,
  count?: number,
  interval?: number,
  byweekday?: number[],
}

export type TimerWorkflow = NewWorkflow & { config: { trigger: { on_timer: TimerOptions }}}

export const timerFlags = {
  trigger: Flags.string({
    required: true,
    multiple: false,
    default: `immediately`,
    options: [`immediately`, `schedule`, `repeat`] as const,
    description: `Trigger immediately or based on a repeating rule`,
  }),
  timezone: Flags.string({
    char: `z`,
    required: true,
    multiple: false,
    default: `local`,
    options: [`local`, `America/New_York`, `America/Chicago`, `America/Denver`, `America/Los_Angeles`, `America/Phoenix`, `Pacific/Honolulu`] as const,
  }),
  start: Flags.string({
    char: `s`,
    default: getTimestampNextHour(),
    noCacheDefault: true,
  }),
  until: Flags.string({
    char: `l`,
    exclusive: [`count`],
  }),
  count: Flags.integer({
    char: `c`,
    exclusive: [`until`],
  }),
  frequency: Flags.string({
    char: `f`,
    multiple: false,
    default: `daily`,
    options: [`daily`, `weekly`, `monthly`, `yearly`] as const,
    hidden: true,
  }),
  interval: Flags.integer({
    char: `I`,
    default: 1,
    hidden: true,
  }),
  day: Flags.string({
    char: `d`,
    multiple: true,
    default: [`MO`,`TU`,`WE`,`TH`,`FR`,`SA`,`SU`],
    description: `Days of the week to repeat on`,
  }),
}
