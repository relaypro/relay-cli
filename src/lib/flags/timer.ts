
import { flags } from '@oclif/command'

import { NewWorkflow } from '../api'

export type TimerOptions = {
  start_time?: string,
  until?: string,
  frequency?: string,
  count?: number,
  interval?: number,
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
    options: [`local`, `utc`, `America/New_York`, `America/Chicago`, `America/Denver`, `America/Los_Angeles`, `America/Phoenix`, `Pacific/Honolulu`],
    helpValue: `one of "local", "utc", offset like "UTC-5", or valid IANA (https://www.iana.org/time-zones) time zone like "America/New_York"`
  }),
  start: flags.string({
    char: `s`,
  }),
  until: flags.string({
    char: `e`,
    exclusive: [`count`],
  }),
  count: flags.integer({
    char: `c`,
    exclusive: [`until`],
  }),
  frequency: flags.enum({
    char: `f`,
    multiple: false,
    default: `hourly`,
    options: [`minutely`, `hourly`, `daily`, `weekly`, `monthly`, `yearly`],
  }),
  interval: flags.integer({
    char: `v`,
  }),
}
