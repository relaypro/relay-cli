
import { flags } from '@oclif/command'

import { NewWorkflow } from '../api'
import { getTimestampFarFuture, getTimestampNextHour } from '../datetime'

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
  trigger: flags.enum({
    required: true,
    multiple: false,
    default: `immediately`,
    options: [`immediately`, `schedule`, `repeat`],
    description: `Trigger immediately or based on a repeating rule`,
  }),
  timezone: flags.enum({
    char: `z`,
    required: true,
    multiple: false,
    default: `local`,
    options: [`local`, `America/New_York`, `America/Chicago`, `America/Denver`, `America/Los_Angeles`, `America/Phoenix`, `Pacific/Honolulu`],
  }),
  start: flags.string({
    char: `s`,
    default: getTimestampNextHour(),
  }),
  until: flags.string({
    char: `l`,
    exclusive: [`count`],
  }),
  count: flags.integer({
    char: `c`,
    exclusive: [`until`],
  }),
  frequency: flags.enum({
    char: `f`,
    multiple: false,
    default: `daily`,
    options: [`daily`, `weekly`, `monthly`, `yearly`],
    hidden: true,
  }),
  interval: flags.integer({
    char: `v`,
    default: 1,
    hidden: true,
  }),
  day: flags.string({
    char: `d`,
    multiple: true,
    default: [`MO`,`TU`,`WE`,`TH`,`FR`,`SA`,`SU`],
    description: `Days of the week to repeat on`,
  }),
}
