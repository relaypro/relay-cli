import filter from 'lodash/filter'
import reduce from 'lodash/reduce'
// import last from 'lodash/last'

import type { ParsingToken } from '@oclif/parser/lib/parse'

import { booleanValue, numberValue, TimerFlags, TimerOptions, TimerWorkflow, WorkflowFlags } from './flags'
import { parseArg } from './utils'
import { NewWorkflow } from './api'
import { getTimestampFarFuture, getTimestampNow, resolveDayValues, resolveTimezone, withoutZ } from './datetime'
import { ALL } from './constants'

export const parseArgs = (tokens: ParsingToken[]): Record<string, never> => {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const normalArgFlags = filter(tokens, ({ flag }: any) => `arg` === flag)
  const normalArgs = reduce(normalArgFlags, (args, flag) => {
    const [, name, value] = parseArg(flag.input)
    return { ...args, [name]: value }
  }, {})

  const booleanParser = booleanValue().parse
  const booleanFlags = filter(tokens, ({ flag }: any) => `boolean` === flag)
  const booleanArgs = reduce(booleanFlags, (args: Record<string, any>, flag) => {
    const nameValue = booleanParser(flag.input, null)
    return { ...args, ...nameValue }
  }, {})

  const numberParser = numberValue().parse
  const numberFlags = filter(tokens, ({ flag }: any) => `number` === flag)
  const numberArgs = reduce(numberFlags, (args: Record<string, any>, flag) => {
    const nameValue = numberParser(flag.input, null)
    return { ...args, ...nameValue }
  }, {})
  /* eslint-enable @typescript-eslint/no-explicit-any */

  return { ...normalArgs, ...booleanArgs, ...numberArgs }
}

export const createWorkflow = (flags: WorkflowFlags, tokens: ParsingToken[]): NewWorkflow => {

  const args = parseArgs(tokens)

  const workflow: NewWorkflow = {
    name: flags.name,
    options: {
      transient: flags.transient,
      hidden: flags.hidden,
      absorb_triggers: flags.absorb,
    },
    config: {
      trigger: {
        start: {
          workflow: {
            uri: flags.uri,
            args,
          }
        }
      }
    }
  }

  if (flags[`install-all`]) {
    workflow.install_rule = ALL
  } else {
    workflow.install = flags.install || []
  }

  return workflow
}

export const createTimerWorkflow = (flags: TimerFlags, tokens: ParsingToken[]): TimerWorkflow => {
  const workflow: TimerWorkflow = createWorkflow(flags, tokens) as TimerWorkflow

  if (flags.trigger === `immediately`) {
    workflow.config.trigger.on_timer = { start_time: `immediately` }
  } else if (!flags.start) {
    throw new Error(`Trigger type timer with repeating rule requires specifying a start time. For instance '--start ${getTimestampNow()}'`)
  } else {
    const options: TimerOptions = {}
    options.start_time = withoutZ(flags.start)

    if (flags.timezone) {
      options.timezone = resolveTimezone(flags.timezone)
    }

    if (flags.trigger === `schedule`) {
      // schedule... set count to 1
      if (flags.until !== undefined || flags.count !== undefined) {
        throw new Error(`Trigger type schedule runs once in the future and cannot define "count" or "until" values`)
      }
      options.count = 1
    } else {
      // repeat
      if (flags.until && flags.count !== undefined) {
        throw new Error(`Trigger type timer with repeating rule cannot define both a "count" and "until" value`)
      } else if (flags.until === undefined && flags.count === undefined) {
        throw new Error(`Trigger type timer with repeating rule must define one of "count" or "until" value`)
      }

      if (flags.frequency) {
        options.frequency = flags.frequency
      }

      if (flags.interval !== undefined) {
        options.interval = flags.interval
      }

      if (flags.count !== undefined) {
        options.count = flags.count
      } else {
        options.until = getTimestampFarFuture()
      }

      if (flags.until) {
        options.until = withoutZ(flags.until)
      }

      if (flags.day) {
        options.byweekday = resolveDayValues(flags.day)
      }
    }

    workflow.config.trigger.on_timer = options
  }
  return workflow
}
