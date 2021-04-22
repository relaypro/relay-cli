import { DateTime } from 'luxon'

import { Command } from '../../../lib/command'
import { enum as enumFlag, string, integer, workflowArgs, workflowFlags } from '../../../lib/flags'

// eslint-disable-next-line quotes
import debugFn = require('debug')
import { NewWorkflow } from '../../../lib/api'
import { createWorkflow, printWorkflows } from '../../../lib/workflow'

const debug = debugFn(`workflow:create:timer`)

type TimerOptions = {
  start_time?: string,
  until?: string,
  frequency?: string,
  count?: number,
  interval?: number,
}

type TimerWorkflow = NewWorkflow & { config: { trigger: { on_timer: TimerOptions }}}

const getTimestampFromFlag = (value: string, zone: string): string => {
  const dateTime = DateTime.fromISO(value, { zone })
  const dateTimeUTC = dateTime.toUTC()
  const timestamp = dateTimeUTC.toISO({ suppressMilliseconds: true, includeOffset: false })
  if (!timestamp) {
    throw new Error(`failed to parse ${value} with timezone ${zone}`)
  } else {
    return timestamp
  }
}

const getTimestampNow = (): string => {
  return DateTime.local().set({ millisecond: 0 }).toISO({ suppressMilliseconds: true, includeOffset: false })
}

export class TimerWorkflowCommand extends Command {

  static description = `Create or update a workflow triggered immediately or with a recurrence rule`

  static strict = false

  static flags = {
    ...workflowFlags,
    trigger: enumFlag({
      required: true,
      multiple: false,
      default: `immediately`,
      options: [`immediately`, `rule`],
      description: `Trigger immediately or based on a recurrence rule`,
    }),
    timezone: enumFlag({
      char: `z`,
      required: true,
      multiple: false,
      default: `local`,
      options: [`local`, `utc`, `America/New_York`, `America/Chicago`, `America/Denver`, `America/Los_Angeles`, `America/Phoenix`, `Pacific/Honolulu`],
      helpValue: `one of "local", "utc", offset like "UTC-5", or valid IANA (https://www.iana.org/time-zones) time zone like "America/New_York"`
    }),
    start: string({
      char: `s`,
    }),
    until: string({
      char: `e`,
      exclusive: [`count`],
    }),
    count: integer({
      char: `c`,
      exclusive: [`until`],
    }),
    frequency: enumFlag({
      char: `f`,
      multiple: false,
      default: `hourly`,
      options: [`minutely`, `hourly`, `daily`, `weekly`, `monthly`, `yearly`],
    }),
    interval: integer({
      char: `v`,
    }),
  }

  static args = [
    ...workflowArgs
  ]

  async run(): Promise<void> {
    const { flags, argv, raw } = this.parse(TimerWorkflowCommand)

    try {

      const workflow: TimerWorkflow = createWorkflow(flags, argv, raw) as TimerWorkflow

      if (flags.trigger === `immediately`) {
        workflow.config.trigger.on_timer = { start_time: `immediately` }
      } else if (!flags.start) {
        throw new Error(`Trigger type timer with recurrence rule requires specifying a start time. For instance '--start ${getTimestampNow()}'`)
      } else if (flags.until && flags.count !== undefined) {
        throw new Error(`Trigger type timer with recurrence rule cannot define both a "count" and "until" value`)
      } else if (flags.until === undefined && flags.count === undefined) {
        throw new Error(`Trigger type timer with recurrence rule must define one of "count" and "until" value`)
      } else {
        const options: TimerOptions = {}
        options.start_time = getTimestampFromFlag(flags.start, flags.timezone)

        if (flags.until) {
          options.until = getTimestampFromFlag(flags.until, flags.timezone)
        }

        if (flags.frequency) {
          options.frequency = flags.frequency
        }

        if (flags.interval !== undefined) {
          options.interval = flags.interval
        }

        if (flags.count !== undefined) {
          options.count = flags.count
        }

        workflow.config.trigger.on_timer = options
      }

      debug(workflow)

      const workflows = await this.relay.saveWorkflow(workflow)

      printWorkflows(workflows)

    } catch (err) {
      debug(err)
      this.error(err)
    }
  }
}
